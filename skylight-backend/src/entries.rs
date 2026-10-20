use serde::{Deserialize, Serialize};

use crate::weather::Weather;

// Entries are stored in Supabase, in the `entries` table (see supabase/schema.sql).
// We use Supabase's REST API: GET to read rows, POST to insert one.

// What the frontend sends when saving
#[derive(Deserialize)]
pub struct NewEntry {
    pub date: String, // "2026-10-20"
    pub country_code: String,
    pub mood: u8, // 1 to 5
    pub note: String,
    pub activities: Vec<String>,
}

// One row of the table (the `id` column is ignored: we don't need it)
#[derive(Deserialize, Serialize, Clone)]
pub struct Entry {
    pub created_at: u64, // seconds since 1970 (Unix time)
    pub date: String,
    pub country_code: String,
    pub country_name: String,
    pub mood: u8,
    pub note: String,
    pub activities: Vec<String>,
    pub weather: Weather,
}

// The table's address and the secret key, from .env
fn supabase() -> Result<(String, String), String> {
    let url = std::env::var("SUPABASE_URL").map_err(|_| "SUPABASE_URL is missing")?;
    let key = std::env::var("SECRET_KEY").map_err(|_| "SECRET_KEY is missing")?;
    Ok((format!("{}/rest/v1/entries", url.trim_end_matches('/')), key))
}

// All entries, newest first
pub async fn load_entries() -> Result<Vec<Entry>, String> {
    let (url, key) = supabase()?;

    let response = reqwest::Client::new()
        .get(url)
        .query(&[("select", "*"), ("order", "date.desc,created_at.desc")])
        .header("apikey", &key)
        .header("Authorization", format!("Bearer {}", key))
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if !response.status().is_success() {
        return Err(format!("Supabase error: {}", response.text().await.unwrap_or_default()));
    }

    response.json().await.map_err(|e| e.to_string())
}

// Adds one entry
pub async fn insert_entry(entry: &Entry) -> Result<(), String> {
    let (url, key) = supabase()?;

    let response = reqwest::Client::new()
        .post(url)
        .header("apikey", &key)
        .header("Authorization", format!("Bearer {}", key))
        .header("Prefer", "return=minimal") // we don't need the row sent back
        .json(entry)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if !response.status().is_success() {
        return Err(format!("Supabase error: {}", response.text().await.unwrap_or_default()));
    }

    Ok(())
}
