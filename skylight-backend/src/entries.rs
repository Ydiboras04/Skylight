use serde::{Deserialize, Serialize};

use crate::weather::Weather;

// The file where all entries are saved (in the folder where you run `cargo run`)
const FILE_PATH: &str = "entries.json";

// What the frontend sends when saving
#[derive(Deserialize)]
pub struct NewEntry {
    pub date: String, // "2026-10-20"
    pub country_code: String,
    pub mood: u8, // 1 to 5
    pub note: String,
    pub activities: Vec<String>,
}

// What we save and send back: the entry + the weather at that moment
#[derive(Deserialize, Serialize, Clone)]
pub struct Entry {
    // When it was saved, in seconds since 1970 (Unix time). Also used as a unique id.
    // #[serde(default)]: old entries without this field load with 0 instead of failing.
    #[serde(default)]
    pub created_at: u64,
    pub date: String,
    pub country_code: String,
    pub country_name: String,
    pub mood: u8,
    pub note: String,
    pub activities: Vec<String>,
    pub weather: Weather,
}

pub fn load_entries() -> Vec<Entry> {
    // If the file doesn't exist yet (first run), start with an empty list
    // If the file exists but can't be read, stop instead of returning an empty list:
    // otherwise the next save would erase everything.
    match std::fs::read_to_string(FILE_PATH) {
        Ok(text) => serde_json::from_str(&text).expect("entries.json is not valid"),
        Err(_) => Vec::new(),
    }
}

pub fn save_entries(entries: &Vec<Entry>) {
    let text = serde_json::to_string_pretty(entries).unwrap();
    std::fs::write(FILE_PATH, text).expect("could not write entries.json");
}
