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
