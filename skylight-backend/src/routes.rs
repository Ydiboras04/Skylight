use axum::extract::Path;
use axum::http::StatusCode;
use axum::Json;

use crate::countries::{load_countries, Country};
use crate::entries::{insert_entry, load_entries, Entry, NewEntry};
use crate::weather::{fetch_weather, Weather};

// GET /api/countries
pub async fn get_countries() -> Json<Vec<Country>> {
    Json(load_countries())
}

// GET /api/countries/MG/weather
pub async fn get_weather(Path(code): Path<String>) -> Result<Json<Weather>, StatusCode> {
    let countries = load_countries();

    let country = match countries.iter().find(|c| c.code.eq_ignore_ascii_case(&code)) {
        Some(c) => c,
        None => return Err(StatusCode::NOT_FOUND),
    };

    match fetch_weather(country.latitude, country.longitude).await {
        Ok(weather) => Ok(Json(weather)),
        Err(_) => Err(StatusCode::BAD_GATEWAY),
    }
}

// GET /api/entries
pub async fn get_entries() -> Result<Json<Vec<Entry>>, StatusCode> {
    match load_entries().await {
        Ok(entries) => Ok(Json(entries)),
        Err(error) => Err(database_error(error)),
    }
}

// POST /api/entries
pub async fn create_entry(Json(new_entry): Json<NewEntry>) -> Result<Json<Entry>, StatusCode> {
    if new_entry.mood < 1 || new_entry.mood > 5 {
        return Err(StatusCode::BAD_REQUEST);
    }

    let countries = load_countries();
    let country = match countries
        .iter()
        .find(|c| c.code.eq_ignore_ascii_case(&new_entry.country_code))
    {
        Some(c) => c,
        None => return Err(StatusCode::NOT_FOUND),
    };

    // The backend fetches the weather itself, so it's always real
    let weather = match fetch_weather(country.latitude, country.longitude).await {
        Ok(w) => w,
        Err(_) => return Err(StatusCode::BAD_GATEWAY),
    };

    let now = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_secs();

    let entry = Entry {
        created_at: now,
        date: new_entry.date,
        country_code: country.code.clone(),
        country_name: country.name.clone(),
        mood: new_entry.mood,
        note: new_entry.note,
        activities: new_entry.activities,
        weather,
    };

    if let Err(error) = insert_entry(&entry).await {
        return Err(database_error(error));
    }

    Ok(Json(entry))
}

// Logs a Supabase error in the backend terminal and answers 502 to the frontend
pub fn database_error(error: String) -> StatusCode {
    eprintln!("{}", error);
    StatusCode::BAD_GATEWAY
}
