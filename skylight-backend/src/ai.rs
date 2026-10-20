use axum::extract::{Path, Query};
use axum::http::StatusCode;
use axum::Json;
use serde::{Deserialize, Serialize};

use crate::countries::load_countries;
use crate::entries::load_entries;
use crate::gemini::ask_gemini;
use crate::weather::fetch_weather;

// Both AI routes return: { "text": "..." }
#[derive(Serialize)]
pub struct AiAnswer {
    text: String,
}

// Rules shared by both prompts, so answers display nicely in the app
const STYLE: &str = "Answer in plain text (no markdown, no asterisks). Be warm, short and concrete. \
Moods go from 1 (sluggish) to 5 (great). Weather: temperature in °C, wind in km/h, \
cloud_cover in %, precipitation in mm, is_day 1 = day / 0 = night.";

#[derive(Deserialize)]
pub struct WeekQuery {
    since: String, // "2026-10-14": first day of the week, sent by the frontend
}

// GET /api/ai/weekly-reflection?since=2026-10-14
pub async fn weekly_reflection(Query(query): Query<WeekQuery>) -> Result<Json<AiAnswer>, StatusCode> {
    // Dates are "YYYY-MM-DD", so comparing them as text works
    let entries: Vec<_> = load_entries()
        .into_iter()
        .filter(|e| e.date >= query.since)
        .collect();

    if entries.is_empty() {
        return Ok(Json(AiAnswer {
            text: String::from("No entries this week yet. Log a few days and come back!"),
        }));
    }

    let prompt = format!(
        "You are the reflection assistant of Skylight, a mood and weather journal.\n\
        Here are the user's journal entries from this week (JSON):\n{}\n\n\
        Write a weekly reflection with:\n\
        1. A short summary of the week (mood trend, main activities).\n\
        2. Any link you notice between the weather and the mood or activities.\n\
        3. One gentle suggestion for next week.\n\n{}",
        serde_json::to_string(&entries).unwrap(),
        STYLE
    );

    answer(prompt).await
}

// GET /api/ai/recommendations/MG
pub async fn recommendations(Path(code): Path<String>) -> Result<Json<AiAnswer>, StatusCode> {
    let countries = load_countries();
    let country = match countries.iter().find(|c| c.code.eq_ignore_ascii_case(&code)) {
        Some(c) => c,
        None => return Err(StatusCode::NOT_FOUND),
    };

    let weather = match fetch_weather(country.latitude, country.longitude).await {
        Ok(w) => w,
        Err(_) => return Err(StatusCode::BAD_GATEWAY),
    };

    // The 20 most recent entries, so the advice is personal (entries are sorted newest first)
    let recent: Vec<_> = load_entries().into_iter().take(20).collect();

    let prompt = format!(
        "You are the assistant of Skylight, a mood and weather journal.\n\
        Current weather in {} (JSON): {}\n\
        The user's recent journal entries (JSON, may be empty): {}\n\n\
        Give 3 recommendations for today based on the current weather. \
        If the entries show what kind of weather or activities lift the user's mood, use that. \
        One line per recommendation, starting with an emoji.\n\n{}",
        country.name,
        serde_json::to_string(&weather).unwrap(),
        serde_json::to_string(&recent).unwrap(),
        STYLE
    );

    answer(prompt).await
}

// Calls Gemini and turns the result into an HTTP response
async fn answer(prompt: String) -> Result<Json<AiAnswer>, StatusCode> {
    match ask_gemini(prompt).await {
        Ok(text) => Ok(Json(AiAnswer { text })),
        Err(error) => {
            eprintln!("{}", error); // details in the backend terminal
            Err(StatusCode::BAD_GATEWAY)
        }
    }
}
