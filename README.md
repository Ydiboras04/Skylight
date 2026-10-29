# Skylight 🌍

**Broadcast a thought to the world — and see everyone else's on a globe.**

Pick a mood face, write what's on your mind, and Skylight pins it to a 3D globe at your
location. Every pin shows the sender's mood; hover one to read their thought. Your
location is detected automatically and can't be changed, and the whole app shifts its
look with your local time of day — morning, afternoon, evening and a dark night mode.

🔗 **Live demo:** [skylight-zeta.vercel.app](https://skylight-zeta.vercel.app)

![Skylight globe](docs/preview.png)

## Features

- **Thought broadcast**: pick a mood from Sluggish to Great and share a thought. It
  appears for everyone as a pin on a 3D globe.
- **Mood pins, hover to read**: each pin is just the sender's mood face; hovering it
  reveals the thought and where it came from.
- **Fixed, auto-detected location**: your position comes from the browser (with an IP
  fallback) and can't be changed — thoughts are pinned where you actually are.
- **Local time-of-day theme**: morning, afternoon, evening and night (dark mode),
  driven by the real local time at your location.
- **Live weather**: each thought stores the temperature, wind, clouds and rain at the
  moment it was sent.

## Tech stack

| Part | Technology |
|---|---|
| Frontend | [Preact](https://preactjs.com/) + TypeScript + [Vite](https://vite.dev/) + [globe.gl](https://globe.gl/) |
| Backend | Rust + [axum](https://github.com/tokio-rs/axum) |
| Database | [Supabase](https://supabase.com/) (Postgres) |
| Weather | [Open-Meteo](https://open-meteo.com/) (free, no key needed) |
| Location | Browser Geolocation · [ipapi.co](https://ipapi.co/) fallback |
| Hosting | Vercel (frontend) · Render (backend) |

## Project structure

```
skylight/
├── skylight-backend/          Rust API
│   ├── src/
│   │   ├── main.rs            server + routes
│   │   ├── routes.rs          weather + thoughts (entries)
│   │   ├── entries.rs         thought storage (Supabase)
│   │   ├── weather.rs         Open-Meteo client
│   │   ├── countries.rs       nearest-country label from coordinates
│   │   └── data/countries_data.json
│   └── supabase/schema.sql    database table
└── skylight-frontend/         Preact app
    └── src/
        ├── app.tsx            layout + location/theme/data loading
        ├── api.ts             calls to the backend
        ├── location.ts        auto-detect the fixed location
        ├── dates.ts           local time-of-day → theme
        └── components/        Header, Globe, EntryForm, Clock
```

## API

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/weather?lat=..&lng=..` | Live weather at a point (used for the time-of-day theme) |
| `GET` | `/api/entries` | All thoughts, newest first |
| `POST` | `/api/entries` | Broadcast a thought `{ lat, lng, mood, note }` (the backend adds the live weather) |

## Run it locally

You need [Rust](https://rustup.rs/), [Node.js](https://nodejs.org/) and a [Supabase](https://supabase.com/) project.

**1. Database:** in Supabase, open the **SQL Editor** and run [`skylight-backend/supabase/schema.sql`](skylight-backend/supabase/schema.sql).

**2. Backend**

```bash
cd skylight-backend
cp .env.example .env    # then fill in SUPABASE_URL and SECRET_KEY
cargo run               # http://localhost:3000
```

**3. Frontend**

```bash
cd skylight-frontend
npm install
npm run dev             # http://localhost:5173
```

With `VITE_API_URL` left empty, the frontend uses the local backend through Vite's proxy. Set it in `skylight-frontend/.env` to use a deployed backend instead.

## Deployment

- **Backend (Render):** root directory `skylight-backend`, build `cargo build --release`, start `./target/release/skylight-backend`. Add `SUPABASE_URL` and `SECRET_KEY` as environment variables.
- **Frontend (Vercel):** root directory `skylight-frontend`. Add `VITE_API_URL` set to the backend's URL.

## License

None
