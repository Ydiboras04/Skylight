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

A daily mood journal that pairs how you feel with the live weather. Log your mood, notes and activities, see how sunshine and rain affect you, and get AI weekly reflections and weather-based tips. Rust (axum) + Preact + Supabase + Gemini.

Website: https://skylight-zeta.vercel.app

Topics: rust axum preact vite typescript supabase gemini open-meteo mood-tracker journal weather
