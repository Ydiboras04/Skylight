use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Clone)]
pub struct Weather {
    pub temperature_2m: f64,
    pub wind_speed_10m: f64,
    pub cloud_cover: f64,
    pub is_day: u8,
    pub precipitation: f64,
}

#[derive(Deserialize)]
struct OpenMeteoResponse {
    current: Weather,
}

pub async fn fetch_weather(latitude: f64, longitude: f64) -> Result<Weather, reqwest::Error> {
    let url = format!(
        "https://api.open-meteo.com/v1/forecast?latitude={}&longitude={}&current=temperature_2m,wind_speed_10m,cloud_cover,is_day,precipitation",
        latitude, longitude
    );

    let res: OpenMeteoResponse = reqwest::get(url).await?.json().await?;
    Ok(res.current)
}
