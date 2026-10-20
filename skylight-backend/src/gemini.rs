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

    // Gemini is sometimes briefly overloaded (503) or rate-limited (429).
    // Those errors usually pass, so we try up to 3 times, waiting a bit longer each time.
    let client = reqwest::Client::new();
    let mut attempt = 1;

    let response = loop {
        let response = client
            .post(URL)
            .header("x-goog-api-key", &api_key)
            .json(&body)
            .send()
            .await
            .map_err(|e| e.to_string())?;

        let status = response.status();
        if status.is_success() {
            break response;
        }

        let temporary = status.as_u16() == 429 || status.is_server_error();
        let error = response.text().await.unwrap_or_default();

        if !temporary || attempt == 3 {
            return Err(format!("Gemini error ({}): {}", status, error));
        }

        eprintln!("Gemini error ({}), retrying (attempt {} of 3)", status, attempt);
        tokio::time::sleep(std::time::Duration::from_secs(2 * attempt)).await;
        attempt += 1;
    };

    let data: GeminiResponse = response.json().await.map_err(|e| e.to_string())?;

    match data.candidates.first().and_then(|c| c.content.parts.first()) {
        Some(part) => Ok(part.text.clone()),
        None => Err(String::from("Gemini returned no answer")),
    }
}
