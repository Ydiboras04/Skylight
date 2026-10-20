use axum::routing::get;
use axum::Router;
use tower_http::cors::CorsLayer;

mod countries;
mod entries;
mod routes;
mod weather;

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/api/countries", get(routes::get_countries))
        .route("/api/countries/{code}/weather", get(routes::get_weather))
        .route("/api/entries", get(routes::get_entries).post(routes::create_entry))
        .layer(CorsLayer::permissive()); // lets the Preact app call this API

    let listener = tokio::net::TcpListener::bind("127.0.0.1:3000").await.unwrap();
    println!("Backend running on http://127.0.0.1:3000");
    axum::serve(listener, app).await.unwrap();
}
