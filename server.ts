import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const NASA_API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';

const FALLBACK_APOD = {
  title: 'Tycho Crater and the Lunar South Highlands',
  date: '2026-10-18',
  explanation:
    'Captured by NASA Lunar Reconnaissance Orbiter, this oblique view shows the terraced walls and central peak of Tycho Crater. Studying crater rims and permanently shadowed regions near the lunar poles helps mission planners locate water ice and safe landing zones.',
  url: '/moon_outpost_backdrop_1794404718128.jpg',
  copyright: 'NASA / GSFC / Arizona State University (Sample Fallback)',
  isFallback: true,
};

const FALLBACK_DONKI = [
  {
    flrID: '2024-05-14T16:46:00-FLR-001',
    beginTime: '2024-05-14T16:46Z',
    peakTime: '2024-05-14T16:51Z',
    classType: 'X8.7',
    sourceLocation: 'S18W89',
    note: 'Strongest flare of Solar Cycle 25 to date, recorded by GOES-16.',
    isFallback: true,
  },
  {
    flrID: '2024-10-03T12:08:00-FLR-001',
    beginTime: '2024-10-03T12:08Z',
    peakTime: '2024-10-03T12:18Z',
    classType: 'X9.0',
    sourceLocation: 'S16W02',
    note: 'Earth-directed X9.0 solar flare from Active Region 3842.',
    isFallback: true,
  },
];

const FALLBACK_MARS_WEATHER = {
  sol: '4120',
  terrestrial_date: '2024-03-10',
  min_temp_c: -73,
  max_temp_c: -11,
  pressure_pa: 742,
  atmo_opacity: 'Sunny',
  source: 'NASA MSL Curiosity / REMS (Sample Archive)',
  isFallback: true,
};

app.get('/api/nasa/apod', async (_req, res) => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4500);
    const response = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${encodeURIComponent(NASA_API_KEY)}`,
      { signal: controller.signal }
    );
    clearTimeout(timeout);
    if (!response.ok) throw new Error(`APOD HTTP ${response.status}`);
    const data = await response.json();
    if (data.media_type !== 'image') {
      return res.json(FALLBACK_APOD);
    }
    return res.json({
      title: data.title,
      date: data.date,
      explanation: data.explanation,
      url: data.url,
      copyright: data.copyright || 'NASA / Public Domain',
      isFallback: false,
    });
  } catch {
    return res.json(FALLBACK_APOD);
  }
});

app.get('/api/nasa/donki', async (_req, res) => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4500);
    const end = new Date().toISOString().slice(0, 10);
    const start = new Date(Date.now() - 30 * 86400 * 1000).toISOString().slice(0, 10);
    const response = await fetch(
      `https://api.nasa.gov/DONKI/FLR?startDate=${start}&endDate=${end}&api_key=${encodeURIComponent(NASA_API_KEY)}`,
      { signal: controller.signal }
    );
    clearTimeout(timeout);
    if (!response.ok) throw new Error(`DONKI HTTP ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) {
      return res.json(FALLBACK_DONKI);
    }
    return res.json(
      data.slice(0, 5).map((item: Record<string, unknown>) => ({
        flrID: item.flrID,
        beginTime: item.beginTime,
        peakTime: item.peakTime,
        classType: item.classType,
        sourceLocation: item.sourceLocation || 'Solar Disk',
        note: item.note || 'Recorded by NASA Space Weather Database (DONKI).',
        isFallback: false,
      }))
    );
  } catch {
    return res.json(FALLBACK_DONKI);
  }
});

app.get('/api/nasa/mars-weather', async (_req, res) => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4500);
    const response = await fetch(
      `https://api.nasa.gov/insight_weather/?api_key=${encodeURIComponent(NASA_API_KEY)}&feedtype=json&ver=1.0`,
      { signal: controller.signal }
    );
    clearTimeout(timeout);
    if (!response.ok) throw new Error(`Mars Weather HTTP ${response.status}`);
    const data = await response.json();
    const solKeys: string[] = data.sol_keys || [];
    if (solKeys.length === 0) {
      return res.json(FALLBACK_MARS_WEATHER);
    }
    const latestSol = solKeys[solKeys.length - 1];
    const solData = data[latestSol];
    return res.json({
      sol: latestSol,
      terrestrial_date: solData?.First_UTC?.slice(0, 10) || FALLBACK_MARS_WEATHER.terrestrial_date,
      min_temp_c: Math.round(solData?.AT?.mn ?? FALLBACK_MARS_WEATHER.min_temp_c),
      max_temp_c: Math.round(solData?.AT?.mx ?? FALLBACK_MARS_WEATHER.max_temp_c),
      pressure_pa: Math.round(solData?.PRE?.av ?? FALLBACK_MARS_WEATHER.pressure_pa),
      atmo_opacity: 'Clear / Dusty',
      source: 'NASA InSight Lander',
      isFallback: false,
    });
  } catch {
    return res.json(FALLBACK_MARS_WEATHER);
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Sol One mission server running on http://localhost:${PORT}`);
  });
}

startServer();