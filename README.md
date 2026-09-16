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
- [ ] F2 — Sensor Simulator
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

### 2. Backend, frontend, simulator

_To be documented as each piece is implemented._

## What I'd improve with more time

_To be filled in near the end._
