use serde::Deserialize;
use serde_json::json;

// "latest" always points to Google's current Flash model
const URL: &str =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";

// Only the parts of Gemini's answer we need: candidates[0].content.parts[0].text
#[derive(Deserialize)]
struct GeminiResponse {
    candidates: Vec<Candidate>,
}

#[derive(Deserialize)]
struct Candidate {
    content: Content,
}

#[derive(Deserialize)]
struct Content {
    parts: Vec<Part>,
}

#[derive(Deserialize)]
struct Part {
    text: String,
}

// Sends a prompt to Gemini and returns its text answer
pub async fn ask_gemini(prompt: String) -> Result<String, String> {
    // The key comes from .env (loaded in main.rs)
    let api_key = std::env::var("GEMINI_API_KEY").map_err(|_| "GEMINI_API_KEY is missing")?;

    let body = json!({
        "contents": [{ "parts": [{ "text": prompt }] }]
    });

    let response = reqwest::Client::new()
        .post(URL)
        .header("x-goog-api-key", api_key)
        .json(&body)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if !response.status().is_success() {
        let error = response.text().await.unwrap_or_default();
        return Err(format!("Gemini error: {}", error));
    }

    let data: GeminiResponse = response.json().await.map_err(|e| e.to_string())?;

    match data.candidates.first().and_then(|c| c.content.parts.first()) {
        Some(part) => Ok(part.text.clone()),
        None => Err(String::from("Gemini returned no answer")),
    }
}
