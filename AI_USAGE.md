# AI Usage Disclosure

This file tracks where AI assistance (Claude) was used while building this project,
and the reasoning behind decisions — not just "AI generated this." Entries are added
incrementally as each part of the project is built.

## Architecture & planning

Used Claude to draft the initial architecture/design document (module boundaries,
data models, REST contract, folder layout) before writing any code, so the DI
structure and data flow were thought through up front rather than discovered
ad hoc while coding. All architectural choices (domain-oriented NestJS modules,
separate Alert collection, Zod co-located with its schema owner, etc.) were
reviewed and are explained in the architecture doc's rationale sections.

## Repo & backend/frontend scaffolding

Used Claude to scaffold the initial repository layout, `docker-compose.yml`
(Mosquitto + MongoDB), the NestJS backend module skeleton, and the Vite/React/
UnoCSS frontend skeleton, following the folder structure laid out in the
architecture document. This was chosen to keep the skeleton consistent with the
design doc from the first commit, rather than freehand scaffolding that would
need to be reconciled with the design later.

_(Further entries added as ingestion, alerting, the simulator, and the dashboard
UI are implemented.)_
