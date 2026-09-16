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

## Running locally

_To be documented as each piece is implemented._

## What I'd improve with more time

_To be filled in near the end._
