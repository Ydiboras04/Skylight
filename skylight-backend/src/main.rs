use axum::routing::get;
use axum::Router;
use tower_http::cors::CorsLayer;

mod countries;
mod entries;
mod routes;
mod weather;

#[tokio::main]
async fn main() {
    dotenvy::dotenv().ok(); // loads SUPABASE_URL / SECRET_KEY from .env

    let app = Router::new()
        .route("/api/weather", get(routes::get_weather))
        .route("/api/entries", get(routes::get_entries).post(routes::create_entry))
        .layer(CorsLayer::permissive()); // lets the Preact app call this API

    // Port 3000 by default, or PORT=4000 cargo run
    let port = std::env::var("PORT").unwrap_or(String::from("3000"));
    // 0.0.0.0 = reachable from outside (needed on a host like Render), not only from this computer
    let address = format!("0.0.0.0:{}", port);

    let listener = tokio::net::TcpListener::bind(&address).await.unwrap();
    println!("Backend running on http://{}", address);
    axum::serve(listener, app).await.unwrap();
}
