# Digital Bridge Accessible Onboarding Module (Track 1)

## What it does

A lightweight, framework-free `<db-signup>` Web Component that lets learning platforms and job boards embed a voice-guided, bilingual (English and Amharic) onboarding, sign-in, profile-edit, and job-application flow using a single classic `<script defer>` tag. It saves every answer and UI preference locally in IndexedDB/localStorage for offline and reload recovery, supports no-document partner referrals, records explicit consent, and keeps sensitive accessibility support preferences strictly separated from profile and employer payloads. An optional Level 2 Node.js/Express API provides host tenant credential management (PostgreSQL), host learner sign-in/sign-up (`/api/v1/host/*`), and stateless learner payload relay (`/api/v1/learners`) without storing learner personal data in the module PostgreSQL database.

## The main task we tested

"A blind learner with no kebele ID registers by voice in Amharic on a low-cost Android phone, with nobody helping."

## Run it

```bash
npm install
npm run build   # builds module/db-signup.js and syntax-checks core files
npm run dev     # starts server on http://localhost:3000
```

### Combined React app and API

The React app in `../frontend` is built into `../frontend/dist` and served by this Express app.
From `backend/`, run `npm run build` and then `npm start`; the app and `/api/v1/*` endpoints share
the same origin. For frontend development, run the API with `npm run dev`, then run
`npm run dev` from `../frontend` (Vite proxies `/api` to `http://localhost:3000`).
`docker compose up --build` builds and serves both parts together.

Refugee FIN scanning uses browser-side English OCR. The image and full OCR text are not uploaded;
the FIN read from the image and the learner-confirmed FIN are sent to
`POST /api/v1/learners/refugee-id/check` for a temporary text comparison and are not persisted.
A match does not prove document authenticity or identity. Manual FIN entry is accepted but cannot
be verified against an external registry. A trusted RRS/AR verification API and its response
contract must be provided before authoritative identity checks can be implemented.

Local dev URLs (`http://localhost:3000`):
- Standalone blank page proof: `http://localhost:3000/` (`demo/blank.html`)
- Savanna starter integration:
  - Sign-up page: `http://localhost:3000/savanna/pages/signup.html`
  - Profile edit page: `http://localhost:3000/savanna/pages/profile.html`
  - Savanna Career Gateway: `http://localhost:3000/savanna/pages/jobs.html`
- Sign-Up & Log-In portal: `http://localhost:3000/demo/auth.html`
- Career Gateway demo: `http://localhost:3000/demo/jobs.html`
- Interactive API docs (Swagger UI): `http://localhost:3000/docs`

With Docker Compose (runs Node.js app + PostgreSQL + Redis + RabbitMQ, exposing port `8080`):

```bash
docker compose up -d
# Open http://localhost:8080/savanna/pages/signup.html
# Blank page proof: http://localhost:8080/demo/blank.html
# API docs: http://localhost:8080/docs
```

Run automated tests and accessibility checks:

```bash
npm test          # 29 unit, DOM keyboard-nav & database tests
npm run test:a11y # axe-core WCAG 2.2 AA scan across all 10 demo, Savanna & <db-signup> views
```

Project status, remaining tasks, and roadmap: [`PROJECT_STATUS_AND_ROADMAP.md`](PROJECT_STATUS_AND_ROADMAP.md).

## Install, Level 1

Add one `<script>` tag and one custom element anywhere on your page (works inside Savanna or on a blank HTML page with zero Bootstrap):

```html
<script src="/module/db-signup.js" defer></script>
<db-signup lang="am" mode="registration" api="/api"></db-signup>
```

The bundled `/module/db-signup.js` works as a classic `<script defer>` include as well as `<script type="module">`.

**Attributes**:
- `lang`: `en` | `am` (or any drop-in locale code loaded from `module/src/locales/<lang>.json`; default `en`)
- `mode`: `registration` | `signin` | `profile-edit` | `job-apply` (default: `registration`)
- `api`: Optional Level 2 API base URL (`/api` or origin URL such as `http://localhost:8080/api`; omit for pure Level 1 browser-only mode)
- `theme`: Optional theme identifier (reads host `--bs-primary`, `--bs-body-font-family`, `--bs-body-color` with fallbacks)
- `audio-base`: Optional base path for pre-recorded MP3 clips (`{audioBase}/{lang}/{clipKey}.mp3`) used when a device lacks an Amharic system TTS voice

**Events**:
- `db-signup:step` → `{ step, of, flow }`
- `db-signup:done` → `{ submissionId, flow, profile, referralCode, voiceNotes, consent: { accepted, recordedAt }, completedAt }` (never contains support preferences)
- `db-signup:support` → `{ support, preferNotToSay }` (dispatched separately from profile)
- `db-signup:signin` → `{ submissionId, flow, method, phone, referralCode, completedAt }` (dispatched in `mode="signin"`)

## Install, Level 2

OpenAPI specification: [`openapi.yaml`](openapi.yaml) | Interactive docs: `/docs`

Examples below target Docker Compose (`http://localhost:8080`; use `http://localhost:3000` with `npm run dev`):

```bash
# 1. Health check
curl -s http://localhost:8080/health

# 2. Register a host company integration (returns X-API-Key once)
curl -X POST http://localhost:8080/api/v1/companies/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Savanna Platform","email":"dev@savanna.example"}'

# 3. Relay a learner registration (stateless, zero learner DB tables; normalizes 09/07/+251)
curl -X POST http://localhost:8080/api/v1/learners \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: demo-001" \
  -d '{"name":"Test Learner","phone":"0912345678","language":"am","idRoute":"partner_referral","consent":{"accepted":true}}'

# 4. Store support preferences separately
curl -X PUT http://localhost:8080/api/v1/learners/<id>/support \
  -H "Content-Type: application/json" \
  -d '{"support":["captions","interpreter_am"]}'

# 5. Export or delete learner relay data
curl -s http://localhost:8080/api/v1/learners/<id>/export
curl -X DELETE http://localhost:8080/api/v1/learners/<id>

# 6. Host sign-up & returning learner sign-in demo (/api/v1/host/*)
curl -X POST http://localhost:8080/api/v1/host/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"0912345678","referralCode":"DB-REF-XXXXXXXX"}'

# 7. Register a webhook demonstration
curl -X POST http://localhost:8080/api/v1/webhooks \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com/webhook","events":["learner.created"]}'
```

## Install, Level 3

`savanna/pages/jobs.html` and `demo/jobs.html` embed `schema.org/JobPosting` JSON-LD metadata for every job card so search engines and job aggregators can index accessible roles directly.

### How LTI 1.3 would connect

Digital Bridge stays framework- and LMS-agnostic at Level 1. To integrate inside an LTI 1.3 LMS (such as Moodle or Canvas), an LTI 1.3 Tool Provider backend validates the LMS OIDC launch JWT, extracts the pseudonymous `sub` and `locale` claims, renders a standard launch page containing `<db-signup lang="..." mode="registration" api="...">`, listens for `db-signup:done` to map the completed `profile` and `referralCode` back to the LMS user record (while keeping `db-signup:support` isolated in learner-controlled local preferences or an encrypted host accessibility store), and passes an LTI Assignment and Grade Services (AGS) completion callback once onboarding succeeds.

## Languages

Complete English (`module/src/locales/en.js` & `en.json`) and Amharic (`module/src/locales/am.js` & `am.json`) dictionaries cover every question, button, validation error, voice prompt, consent label, and offline status. The component dynamically resolves any locale code (`en`, `am`, `om`, `ti`, `so`, `ar`, etc.) by loading `module/src/locales/<lang>.json` with fallback to English and automatically sets `dir="rtl"` for RTL locales (`ar`). CSS uses logical properties (`margin-inline-start`, `border-inline-start`), `Noto Sans Ethiopic`, `line-height: 1.7`, and Ethiopian calendar receipt dates (`Intl.DateTimeFormat('am-ET-u-ca-ethiopic', ...)`).

## Offline and slow connection

- Classic self-contained bundle `module/db-signup.js`: **99.1 KB** (101,463 bytes) uncompressed, **22.9 KB** (23,402 bytes) gzipped — well under the 500 KB budget, with zero runtime dependencies.
- Every answer saves immediately to IndexedDB (`db-signup-draft-store`) and UI accessibility presets persist across reloads.
- When offline, submissions queue locally with an idempotency key and show `"Saved on this phone. It will send when you are online."` (and Amharic equivalent), then auto-sync when connectivity returns.
- *Pending measurement*: Real Chrome DevTools Slow 3G load timing and physical Android HTTPS testing are scheduled for device verification (estimated transfer time for 22.9 KB gzipped over Slow 3G ~400 kbps is < 1 second once TLS/DNS connects).

## Data and privacy

- **Browser only by default**: Drafts stay in IndexedDB and clear on confirmed submission.
- **Explicit consent**: Registration requires checking the explicit consent box (`consent.accepted` + `consent.recordedAt`) before completing.
- **Strict separation**: Support preferences are emitted in `db-signup:support` and stored locally only for the client-side job filter in `savanna/pages/jobs.html` and `demo/jobs.html`—never sent to employers or included in `db-signup:done`.
- **Zero learner tables in PostgreSQL**: The Level 2 database (`companies`, `api_credentials`, `audit_events`) stores only host integration metadata and redacted audit events.
- **Explicit microphone consent**: Speech recognition and voice-note recording stay off until the learner clicks the control, with audio playback preview before submission.

## Cost to run

For ~3,000 learners/month:
- **Level 1 (Web Component)**: $0/month (static JS/JSON served on existing host CDN or GitHub Pages).
- **Level 2 (Optional Node.js Relay + small Postgres)**: ~$5–10/month on a single small VPS/container, with zero paid AI/voice API lock-in.

## Finished and not finished

- **Finished**:
  - `<db-signup>` Shadow DOM Web Component bundled for classic `<script defer>` (`module/db-signup.js`)
  - Real `alx-africa/Savanna-static-pages` integration (`savanna/pages/signup.html`, `savanna/pages/profile.html`, `savanna/pages/jobs.html`, plus comprehensive keyboard navigation, visible focus rings, ARIA card regions, and logical tab order across `homepage-v1-paced.html`, `homepage-v1-self-paced.html`, `concept-with-navigation.html`, and `savanna/index.html` without modifying Savanna's core CSS/JS)
  - Complete EN/AM locales + dynamic 1-file drop-in support for additional languages (`om`, `ti`, `so`, `ar` RTL)
  - Low-literacy mode, persisted UI presets, synchronized TTS word highlighting, 3-tier EN/AM voice fallback, STT + voice-note recording with audio playback preview
  - Ethiopian phone validation/normalization (`09`/`07`/`+251` -> `+251`) + spoken EN/AM digit parsing
  - Explicit consent checkbox & timestamp, IndexedDB draft recovery + offline queue, privacy-separated events
  - `mode="signin"` + Sign-Up & Log-In portal (`demo/auth.html` + `/api/v1/host/*`)
  - Career Gateway (`savanna/pages/jobs.html` & `demo/jobs.html` with bilingual cards + `schema.org/JobPosting` JSON-LD)
  - Level 2 OpenAPI (`openapi.yaml`), `/docs`, `/api/v1/learners` relay, webhooks, `docker-compose.yml` app + Postgres stack, MIT `LICENSE`
  - Unit tests (`npm test`) and automated `axe-core` WCAG 2.2 AA checks (`npm run test:a11y`)
- **Not finished / next**:
  - Record pre-recorded human Amharic `.mp3` clips under `module/audio/am/` for phones without Amharic system TTS voices
  - Complete live TalkBack (Android over HTTPS via `cloudflared` / `ngrok`), NVDA (Windows), and Chrome DevTools Slow 3G co-designer verification on a real low-cost Android phone

## Libraries and their licences

- `express`, `cors`, `dotenv`, `helmet`, `express-rate-limit`, `pg`, `pino`, `pino-http`, `zod` (MIT)
- `node-pg-migrate`, `axe-core`, `jsdom` (MIT / MPL-2.0 for `axe-core`, devDependencies)
- Web Component (`module/`): zero runtime dependencies
- Project licence: [`LICENSE`](LICENSE) (MIT)
