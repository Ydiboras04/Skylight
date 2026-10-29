use axum::extract::Query;
use axum::http::StatusCode;
use axum::Json;
use serde::Deserialize;

use crate::countries::nearest_country;
use crate::entries::{insert_entry, load_entries, Entry, NewEntry};
use crate::weather::{fetch_weather, Weather};

// A point on the globe, from the query string: ?lat=48.85&lng=2.35
#[derive(Deserialize)]
pub struct Coords {
    pub lat: f64,
    pub lng: f64,
}

// GET /api/weather?lat=48.85&lng=2.35
// Current weather at a point, used by the frontend for the time-of-day theme.
pub async fn get_weather(Query(coords): Query<Coords>) -> Result<Json<Weather>, StatusCode> {
    match fetch_weather(coords.lat, coords.lng).await {
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

// POST /api/entries — broadcast a thought from the sender's coordinates
pub async fn create_entry(Json(new_entry): Json<NewEntry>) -> Result<Json<Entry>, StatusCode> {
    if new_entry.mood < 1 || new_entry.mood > 5 {
        return Err(StatusCode::BAD_REQUEST);
    }

    let note = new_entry.note.trim().to_string();
    if note.is_empty() {
        return Err(StatusCode::BAD_REQUEST);
    }

    // The backend fetches the weather itself, so it's always real
    let weather = match fetch_weather(new_entry.lat, new_entry.lng).await {
        Ok(w) => w,
        Err(_) => return Err(StatusCode::BAD_GATEWAY),
    };

    let now = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_secs();

    // "YYYY-MM-DD" in UTC — the day the thought was sent
    let date = chrono_date(now);
    let (country_code, country_name) = nearest_country(new_entry.lat, new_entry.lng);

    let entry = Entry {
        created_at: now,
        date,
        lat: new_entry.lat,
        lng: new_entry.lng,
        country_code,
        country_name,
        mood: new_entry.mood,
        note,
        activities: Vec::new(),
        weather,
    };

    if let Err(error) = insert_entry(&entry).await {
        return Err(database_error(error));
    }

    Ok(Json(entry))
}

// Unix seconds → "YYYY-MM-DD" (UTC), without pulling in a date library.
fn chrono_date(secs: u64) -> String {
    let days = secs / 86_400;
    // Days since 1970-01-01 → civil date (Howard Hinnant's algorithm)
    let z = days as i64 + 719_468;
    let era = z / 146_097;
    let doe = z - era * 146_097;
    let yoe = (doe - doe / 1460 + doe / 36_524 - doe / 146_096) / 365;
    let y = yoe + era * 400;
    let doy = doe - (365 * yoe + yoe / 4 - yoe / 100);
    let mp = (5 * doy + 2) / 153;
    let d = doy - (153 * mp + 2) / 5 + 1;
    let m = if mp < 10 { mp + 3 } else { mp - 9 };
    let y = if m <= 2 { y + 1 } else { y };
    format!("{:04}-{:02}-{:02}", y, m, d)
}

// Logs a Supabase error in the backend terminal and answers 502 to the frontend
pub fn database_error(error: String) -> StatusCode {
    eprintln!("{}", error);
    StatusCode::BAD_GATEWAY
}
