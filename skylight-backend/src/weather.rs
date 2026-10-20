use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Clone)]
pub struct Weather {
    pub temperature_2m: f64,
    pub wind_speed_10m: f64,
    pub cloud_cover: f64,
    pub is_day: u8,
    pub precipitation: f64,
    // The country's time zone, e.g. "Asia/Tokyo".
    // #[serde(default)]: it's not inside Open-Meteo's "current" block (we fill it in below),
    // and older saved entries don't have it.
    #[serde(default)]
    pub timezone: String,
}

#[derive(Deserialize)]
struct OpenMeteoResponse {
    timezone: String,
    current: Weather,
}

pub async fn fetch_weather(latitude: f64, longitude: f64) -> Result<Weather, reqwest::Error> {
    // timezone=auto: Open-Meteo finds the time zone from the coordinates
    let url = format!(
        "https://api.open-meteo.com/v1/forecast?latitude={}&longitude={}&current=temperature_2m,wind_speed_10m,cloud_cover,is_day,precipitation&timezone=auto",
        latitude, longitude
    );

    let res: OpenMeteoResponse = reqwest::get(url).await?.json().await?;

    let mut weather = res.current;
    weather.timezone = res.timezone;
    Ok(weather)
}
