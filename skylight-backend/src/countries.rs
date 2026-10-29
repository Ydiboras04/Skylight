use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize)]
pub struct Country {
    #[serde(rename(deserialize = "alpha2"))]
    pub code: String,
    #[serde(rename(deserialize = "country"))]
    pub name: String,
    pub latitude: f64,
    pub longitude: f64,
}

#[derive(Deserialize)]
struct CountriesFile {
    ref_country_codes: Vec<Country>,
}

pub fn load_countries() -> Vec<Country> {
    let json_data = include_str!("data/countries_data.json");
    let file: CountriesFile = serde_json::from_str(json_data).expect("invalid countries_data.json");
    file.ref_country_codes
}

// The country whose centroid is closest to the given point, as a (code, name) label.
// Best-effort only (centroids are coarse); used so a thought can show where it came from.
pub fn nearest_country(lat: f64, lng: f64) -> (String, String) {
    load_countries()
        .into_iter()
        .min_by(|a, b| {
            let da = (a.latitude - lat).powi(2) + (a.longitude - lng).powi(2);
            let db = (b.latitude - lat).powi(2) + (b.longitude - lng).powi(2);
            da.total_cmp(&db)
        })
        .map(|c| (c.code, c.name))
        .unwrap_or_default()
}
