# Smart City IoT Sensor Monitoring Dashboard

A small full-stack simulation of a Smart City IoT pipeline: simulated sensors publish
readings over MQTT, a NestJS backend ingests, validates, persists and evaluates them
for threshold-based alerts, and a React dashboard displays readings and alerts.

See `smart-city-dashboard-architecture.md`-derived design decisions summarized below;
this README will be filled in incrementally as each part of the system is built.

## Project layout

```
backend/      NestJS ingestion + REST API
frontend/     React + Vite + TypeScript + UnoCSS dashboard
simulator/    Standalone MQTT sensor simulator (Node/TS)
docker-compose.yml   Mosquitto broker + MongoDB
```

## Status

Work in progress — being built and committed incrementally. This section, along with
run instructions, payload schema, thresholds, and assumptions, will be expanded as
each piece lands.

- [x] F1 — MQTT Broker Setup
- [x] F2 — Sensor Simulator
- [ ] F3 — MQTT Ingestion
- [ ] F4 — Readings Persistence
- [ ] F5 — GET /readings Endpoint
- [ ] F6 — Threshold-Based Alerting
- [ ] F7 — GET /alerts Endpoint
- [ ] F8 — Dashboard: Readings View
- [ ] F9 — Dashboard: Alerts Panel
- [ ] F10 — Polling Refresh
- [ ] F11 — (Bonus) Real-Time Updates

## Running locally

### 1. MQTT broker (+ MongoDB)

```bash
docker compose up -d
```

This starts:

- **Mosquitto** on `localhost:1883` (plain MQTT) and `localhost:9001` (MQTT over
  WebSockets, for a possible bonus browser subscription later). Config lives at
  `backend/docker/mosquitto/mosquitto.conf`.
- **MongoDB** on `localhost:27017`, with a named volume so data survives restarts.

**Auth:** none — `allow_anonymous true` on both listeners. This is a local
take-home-test broker only ever reachable on your machine/Docker network; it is not
exposed publicly and is not intended for production use.

**Verifying the broker manually**, independent of the backend/simulator (useful
while those aren't built yet):

```bash
# terminal 1 — subscribe to the fixed topic structure
mosquitto_sub -h localhost -p 1883 -t 'smartcity/sensors/+/reading' -v

# terminal 2 — publish a sample reading
mosquitto_pub -h localhost -p 1883 -t 'smartcity/sensors/temp-01/reading' \
  -m '{"sensorId":"temp-01","sensorType":"temperature","value":22.5,"unit":"°C","timestamp":"2026-09-16T09:00:00.000Z"}'
```

You should see the message printed in terminal 1. (`mosquitto_sub`/`mosquitto_pub`
come from the `mosquitto-clients` package — `apt install mosquitto-clients` /
`brew install mosquitto`.)

### 2. Sensor simulator

A standalone Node/TS process that publishes fake readings for 3 sensors — `temp-01`
(temperature), `hum-01` (humidity), `aq-01` (air_quality) — each on its own interval
(3s/4s/5s), to `smartcity/sensors/{sensorId}/reading`. The payload shape matches the
backend's inbound schema exactly:

```json
{
  "sensorId": "temp-01",
  "sensorType": "temperature",
  "value": 22.5,
  "unit": "°C",
  "timestamp": "2026-09-16T09:00:00.000Z"
}
```

Each sensor mostly emits values inside its normal range, but with a configurable
probability (`SIM_SPIKE_PROBABILITY`, default `0.15`) emits a value from a range
deliberately outside the backend's alert thresholds (see §"Threshold values" below),
so alerting has something to react to during a demo.

```bash
cd simulator
npm install
cp .env.example .env   # defaults are fine for local dev
npm start               # or: npm run dev (auto-restart on change)
```

Config (`simulator/.env`):

| Var | Default | Purpose |
|---|---|---|
| `MQTT_URL` | `mqtt://localhost:1883` | Broker to publish to |
| `SIM_SPIKE_PROBABILITY` | `0.15` | Chance a reading is generated out-of-threshold |
| `SIM_PUBLISH_INTERVAL_MS` | _(unset)_ | Overrides every sensor's own interval with one fixed value |

### 3. Backend, frontend

_To be documented as each piece is implemented._

## What I'd improve with more time

_To be filled in near the end._
