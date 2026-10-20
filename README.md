# Skylight

Log your daily mood, notes and activities alongside live weather data, and discover how the weather affects you.

- `skylight-backend/` — Rust API (axum), port 3000
- `skylight-frontend/` — Preact + Vite app

## Run

```bash
cd skylight-backend && cp .env.example .env   # then put your Gemini API key in .env
cd skylight-backend && cargo run
cd skylight-frontend && npm install && npm run dev
```
