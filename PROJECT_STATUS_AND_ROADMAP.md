# Digital Bridge Accessible Onboarding Module — Project Status & Roadmap

**Reference Standard:** *Digital Bridge Accessibility Hackathon 2026 — Team Technical Guide v2 (Track 1: `<db-signup>` + Level 2 API + Level 3 `schema.org/JobPosting`)*  
**Current Status Date:** 14 November 2026  
**Related Docs:** [`README.md`](README.md) · [`CONFORMANCE.md`](CONFORMANCE.md) · [`DATABASE.md`](DATABASE.md) · [`openapi.yaml`](openapi.yaml)

> This document replaces earlier fragmented status notes (`PRODUCT_STATUS_ANALYSIS.md`, `QUICK_START.md`, `IMPLEMENTATION_SUMMARY.md`, `TECHNICAL_GUIDE_EVALUATION.md`) with a single source of truth covering **what has been done**, **what is still left**, **what to add**, and **what to remove**.

---

## 1. Verified Baseline at a Glance

- **Classic `<script defer>` Web Component bundle (`module/db-signup.js`):** `101,463 bytes` (`99.1 KB`) uncompressed, `23,402 bytes` (`22.9 KB`) gzipped — zero runtime dependencies.
- **Automated unit, DOM & database tests (`npm test`):** **29/29 passing** across 10 test suites (`tests/database.test.js`, `tests/module.test.js`, `tests/homepage-keyboard.test.js`).
- **Automated `axe-core` WCAG 2.2 AA audit (`npm run test:a11y`):** **0 critical/serious (0 total) violations** across all 10 rendered pages (`demo/blank.html`, `demo/jobs.html`, `demo/auth.html`, `savanna/index.html`, `savanna/pages/signup.html`, `savanna/pages/profile.html`, `savanna/pages/jobs.html`, `savanna/pages/homepage-v1-paced.html`, `savanna/pages/homepage-v1-self-paced.html`, `savanna/pages/concept-with-navigation.html`) plus `<db-signup>` Shadow DOM.
- **Database Ownership:** PostgreSQL stores only host platform integration metadata (`companies`, `api_credentials`, `audit_events`) — **zero learner personal data tables**.

---

## 2. What Has Been Done

### A. Level 1 — `<db-signup>` Drop-in Web Component (`module/`)
- **Self-contained classic script:** `scripts/build-module.mjs` bundles `module/db-signup.js` so host platforms embed it with `<script src="/module/db-signup.js" defer></script>` (as well as ES module support) with full Shadow DOM CSS isolation and `--bs-*` theme inheritance.
- **One-question-per-screen flows (`module/src/flows/index.js`):**
  - `mode="registration"` (name, Ethiopian phone, identity route including no-document `partner_referral` issuing `DB-REF-...`, optional support preferences, explicit consent checkbox)
  - `mode="signin"` (method selection + Ethiopian phone + referral code/PIN -> `db-signup:signin`)
  - `mode="profile-edit"` and `mode="job-apply"`
- **Offline & reload resilience (`module/src/utils/storage.js`):**
  - Every answer saves immediately to IndexedDB (`db-signup-draft-store`) with `localStorage` / memory fallback.
  - UI accessibility presets (`lowLiteracy`, `bigTextContrast`, `noSoundVisual`, voice playback rate) persist across reloads.
  - Offline submission queuing with idempotency keys and exact localized status messages.
- **Privacy separation & consent (`module/src/utils/stepper.js`):**
  - `db-signup:done` emits `{ submissionId, flow, profile, referralCode, voiceNotes, consent: { accepted, recordedAt }, completedAt }` and **never** includes support preferences.
  - `db-signup:support` emits `{ support, preferNotToSay }` separately for browser-only filtering.

### B. Voice Guidance & Ethiopian Context (`module/src/utils/voice.js`, `phone.js`, `locales/`)
- **Complete English (`en`) & Amharic (`am`) locales** with key-for-key parity verified by automated tests.
- **Dynamic 1-file language extensibility:** Arbitrary locale codes load from `module/src/locales/<lang>.json` without modifying component code, with automatic `dir="rtl"` for RTL languages (`ar`).
- **3-tier voice playback:** Exact locale voice selection (`am-ET` / `en-US`) -> `audio-base` MP3 fallback hook (`{audioBase}/{lang}/{clipKey}.mp3`) -> visual text-highlight guidance when TTS is unavailable.
- **Speech input & voice-note fallback:** Optional `SpeechRecognition` (`Speak your answer`) with spoken English & Amharic digit conversion (`zero`/`ዜሮ` .. `nine`/`ዘጠኝ`), plus `MediaRecorder` (`Record voice note`) with an in-component **Play voice note** preview button before submission.
- **Ethiopian phone & calendar formatting:** Accepts `09...`, `07...`, and `+251...`, normalizes to `+251...`, and formats Amharic completion dates with the Ethiopian calendar (`Intl.DateTimeFormat('am-ET-u-ca-ethiopic', ...)`).

### C. Savanna Starter Integration & Learner Homepage Keyboard Navigation (`savanna/`)
- **Starter pages integrated without altering Savanna's original stylesheets/JS (`application_alx.css`, `app.css`, `static-page.js`):**
  - `savanna/pages/signup.html` (`<db-signup lang="am" mode="registration" api="/api">`, redirects to `homepage-v1-paced.html` on completion)
  - `savanna/pages/profile.html` (`mode="profile-edit"`, linked from `"My Profile"` in Savanna's sidebar)
  - `savanna/pages/jobs.html` (Career Gateway inside Savanna shell)
- **Comprehensive keyboard navigation on learner homepage cards (`savanna/assets/css/a11y-enhancements.css`, `savanna/assets/js/homepage-keyboard.js`):**
  - **Visible focus indicators:** High-contrast `:focus-visible` outline (`3px solid #f5a300` + `#002b56` halo) across all focusable elements, inset focus rings inside overflow/scrollable strips so outlines are never clipped, and `:focus-within` tracking on `.homepage-card`.
  - **Logical tab order & skip links:** `"Skip to main content"` (`#content`) and focus-revealed `"Jump to learner homepage card"` bar (`#db-card-jump-nav`) with zero positive `tabindex` values.
  - **Header, sidebar & switcher controls:** Upgraded clickable `<div>` triggers (`.hamburger`, `#student-switch-curriculum`) to `role="button"`, `tabindex="0"`, `aria-expanded`, and `Enter`/`Space`/`ArrowDown`/`Escape` support; preserved accessible names on collapsed sidebar links.
  - **Week strip & cards:** Ordered DOM `Previous -> Week links -> Next`, dynamic `tabindex` on scroll chevrons, `ArrowLeft`/`ArrowRight`/`Home`/`End`/`Space` across week tabs, `MutationObserver` re-enhancement when `<template>` panels swap, `role="region"` + `aria-labelledby` on every card, keyboard-scrollable `.overflow-auto` card lists (`tabindex="0"`), disambiguated `"Resume"` / `"Show"` / `"Start Learning"` labels, `ArrowUp`/`ArrowDown` across upcoming event rows, ARIA `tablist`/`tab` + roving `tabindex` on `"My activities"` (`homepage-v1-self-paced.html`), keyboard-focusable `"My Pacing Boost"` tooltip (`tabindex="0"`, `Escape` dismiss), and modal focus restoration.
  - **Semantic markup fixes:** Fixed `<ul>`/`<hr>` list nesting in `#sidebar` and `curriculum-switcher-menu`, plus heading hierarchy across all Savanna pages.

### D. Demos, Sign-In Portal, Level 2 API & Level 3 Standards
- **Demos (`demo/`):** `demo/blank.html` (zero-framework proof), `demo/jobs.html` (bilingual EN/AM job cards, client-side support filter, accessible `<dialog>` with no auto-close timer), and `demo/auth.html` (Learner Sign-Up, Returning Learner Log-In, and Host Company Portal with inline accessible field errors).
- **Level 2 API (`src/`):** Express 5 + Zod API covering `/api/v1/companies/*` (PostgreSQL HMAC-SHA256 `scrypt`/pepper auth), `/api/v1/learners` (stateless relay with Ethiopian phone validation/normalization and consent recording), `/api/v1/host/*` (demo sign-up/login/support/export/delete), `/api/v1/webhooks`, `openapi.yaml`, and Swagger UI at `/docs`.
- **Level 3 Standards:** `schema.org/JobPosting` JSON-LD embedded on every job card (`savanna/pages/jobs.html` & `demo/jobs.html`).
- **Packaging & Licensing:** Added `Dockerfile`, `docker-compose.yml` (`app` service on `:8080` + `postgres`), and root MIT `LICENSE`.

---

## 3. What Is Still Left

### A. Physical Device & Human Recording Verification (Cannot Be Automated Inside Container)
1. **Unassisted Co-Designer Android HTTPS Test:**
   - Expose local server over HTTPS (`cloudflared tunnel --url http://localhost:3000` or `ngrok`) and have a blind/low-vision co-designer complete Amharic voice registration end-to-end on a low-cost Android phone with **Android TalkBack** enabled and no assistance.
   - Log tester role, device model, OS/browser, screen reader, and any hesitation points in [`CONFORMANCE.md`](CONFORMANCE.md).
2. **Windows NVDA Desktop Walkthrough:**
   - Verify `<db-signup>` and Savanna learner homepage cards end-to-end using **NVDA + Firefox/Chrome** on Windows.
3. **Chrome DevTools Slow 3G Timing Measurement:**
   - Record real cold-load timing (`DOMContentLoaded` and `<db-signup>` interactive time) under **Slow 3G** throttling in Chrome DevTools and update [`README.md`](README.md).
4. **Pre-Recorded Amharic Audio Clips (`module/audio/am/`):**
   - Record clear human-spoken Amharic `.mp3` clips matching step `clipKey` names (`name.mp3`, `phone.mp3`, `identity.mp3`, `support.mp3`, etc.) and wire `audio-base="/module/audio"` in `savanna/pages/signup.html` and `demo/blank.html` so phones without an Amharic system TTS voice still read every question offline.

### B. Functional & Production Extensions (Optional / Post-Hackathon)
1. **Employer Accommodations Intake Form (SRS FR-CAR-07):** Form for employers posting jobs to declare supported workplace accommodations directly into `jobs.json` / host backend.
2. **Service Worker Offline App-Shell Cache:** Cache `module/db-signup.js`, locale JSONs, and fallback `.mp3` audio so reloading while completely offline works even after cold cache eviction.
3. **IndexedDB Audio Blob Persistence Across Reloads:** Persist recorded `MediaRecorder` `Blob` objects (not just metadata) in IndexedDB so learners can replay a voice note even after refreshing the page mid-registration.
4. **Drop-In Additional Ethiopian Locale Files:** Author and verify `om.json` (Afaan Oromo), `ti.json` (Tigrinya), `so.json` (Somali), and `ar.json` (Arabic RTL) alongside `en.json` and `am.json`.
5. **LTI 1.3 Tool Provider Adapter:** Implement the OIDC launch + AGS completion wrapper described in [`README.md`](README.md) if integrating with Moodle/Canvas.

---

## 4. What to Add

| Priority | Item to Add | Why & Where |
|---|---|---|
| **High (Gate)** | Human-recorded Amharic `.mp3` question clips | Guarantees voice-guided Amharic on budget Android phones missing an Amharic TTS engine (`module/audio/am/*.mp3` + `audio-base="/module/audio"`). |
| **High (Gate)** | Real-device TalkBack, NVDA & Slow 3G test log | Required by Technical Guide §11 before final submission (`CONFORMANCE.md` & `README.md`). |
| **Medium** | `om.json` / `ti.json` sample locale file | Demonstrates 1-file Ethiopian multi-language drop-in live in the UI selector (`module/src/locales/`). |
| **Medium** | Service Worker (`sw.js`) for offline shell + audio | Ensures `savanna/pages/signup.html` and `module/db-signup.js` boot offline even without prior browser cache hit. |
| **Low (Production)** | Persistent host adapter for `/api/v1/host/*` & `/api/v1/learners` | Replace ephemeral in-memory `Map` stores in `src/routes/host-auth.js` and `src/routes/learners.js` with host-owned database persistence or webhook relay targets. |

---

## 5. What to Remove / Clean Up

### Already Removed in This Cleanup
- `PRODUCT_STATUS_ANALYSIS.md` — Outdated pre-Level-1 snapshot (falsely reported `<db-signup>` as 0% built).
- `QUICK_START.md` — Obsolete draft referencing non-existent `test-server.js`, port `4000`, and outdated Next Steps.
- `IMPLEMENTATION_SUMMARY.md` — Historical Nov 2025 SQLite-to-PostgreSQL migration log superseded by `DATABASE.md` and this document.
- `TECHNICAL_GUIDE_EVALUATION.md` — Point-in-time audit now consolidated into this status & roadmap document.

### Recommended to Remove / Strip Before Production Deployment
1. **Unused Queue & Cache Stubs (`src/services/redis.js`, `src/services/queue.js`):** Neither file is imported anywhere in `src/` or `tests/`. Remove them (and optionally simplify `redis` / `rabbitmq` services in `docker-compose.yml` if not needed by the host) to reduce deployment surface area.
2. **Legacy Non-Standard Helper / Duplicate Locale Formats (Optional):** `module/src/locales/en.js` and `am.js` duplicate `en.json` and `am.json` (used only by ESM unit tests and `scripts/build-module.mjs`). Unifying `scripts/build-module.mjs` and tests to read directly from `.json` removes duplicate translation maintenance.
3. **Demo-Only Static Pages on Production Hosts:** When deploying only the embeddable module + Level 2 API to production, exclude or gate `/demo/*` and `/savanna/pages/homepage-v1-*.html` static captures behind dev-only routing, keeping `/module/db-signup.js`, `/module/audio/*`, `/api/v1/*`, and `/docs`.
4. **Container-Generated `bun.lock`:** The project uses `npm` (`package.json` + `node`); exclude `bun.lock` in `.gitignore` and Docker builds (`COPY package*.json ./`) if the host environment regenerates it automatically.
