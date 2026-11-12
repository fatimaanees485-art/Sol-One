# Sol One — Junior Astronaut Mission Trainer

Built for the **NASA Space Apps Challenge 2026** (*Build a Junior Astronaut Mission Trainer*).

Sol One teaches students (ages 9–14) that a space habitat is an engineered system with real trade-offs—not just a place to live.

## How to Run

1. Install dependencies:
   ```bash
   npm install
   ```
2. (Optional) Add a `NASA_API_KEY` to `.env` if you have one; otherwise the server uses `DEMO_KEY` and falls back to curated NASA archive data automatically.
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:3000`.
5. Run unit tests:
   ```bash
   npx --yes tsx --test src/game/engine.test.ts
   ```

## NASA Data Sources

- **NASA APOD** (`/api/nasa/apod`): Daily space image on the Home screen.
- **NASA DONKI** (`/api/nasa/donki`): Solar flare (`FLR`) telemetry powering space-weather warnings.
- **NASA InSight / Curiosity Mars Weather** (`/api/nasa/mars-weather`): Martian temperature and pressure data for dust storm events.
- *Disclaimer: Game values are simplified for learning. Independent project, not an official NASA product.*

## Pre-Submission Test Checklist

- [ ] Launch Mission 1 (`Moon Basics`) and advance at least 3 sols.
- [ ] Verify Forecast deltas update when toggling module upgrades or crew assignments.
- [ ] Verify `localStorage` persistence across a page reload.
- [ ] Check `/learn`, `/teachers`, `/about`, and `/404`.
- [ ] Test Reduced Motion and Sound toggles in the footer.
