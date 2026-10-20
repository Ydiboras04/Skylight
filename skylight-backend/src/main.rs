use axum::routing::get;
use axum::Router;
use tower_http::cors::CorsLayer;

mod ai;
mod countries;
mod entries;
mod gemini;
mod routes;
mod weather;

#[tokio::main]
async fn main() {
    dotenvy::dotenv().ok(); // loads GEMINI_API_KEY from .env

    let app = Router::new()
        .route("/api/countries", get(routes::get_countries))
        .route("/api/countries/{code}/weather", get(routes::get_weather))
        .route("/api/entries", get(routes::get_entries).post(routes::create_entry))
        .route("/api/ai/weekly-reflection", get(ai::weekly_reflection))
        .route("/api/ai/recommendations/{code}", get(ai::recommendations))
        .layer(CorsLayer::permissive()); // lets the Preact app call this API

    // Port 3000 by default, or PORT=4000 cargo run
    let port = std::env::var("PORT").unwrap_or(String::from("3000"));
    let address = format!("127.0.0.1:{}", port);

    let listener = tokio::net::TcpListener::bind(&address).await.unwrap();
    println!("Backend running on http://{}", address);
    axum::serve(listener, app).await.unwrap();
}
