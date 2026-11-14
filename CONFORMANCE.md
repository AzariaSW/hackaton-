# WCAG 2.2 AA Conformance Report — Digital Bridge `<db-signup>` (Track 1)

This report follows Section 11 of the Digital Bridge Accessibility Hackathon 2026 Team Technical Guide.

| WCAG 2.2 AA Criterion | Status | Notes |
|---|---|---|
| 1.1.1 Non-text content | Supports | Decorative icons in low-literacy mode use `aria-hidden="true"` paired with full text labels; controls have visible text names. |
| 1.3.1 Info and relationships | Supports | Native `<form>`, `<fieldset>`, `<legend>`, `<label for>`, and `aria-describedby` (including `<fieldset aria-describedby>` on choice/checkbox steps) inside the same Shadow DOM root; host pages (`demo/auth.html`, `savanna/pages/*.html`) use semantic landmarks, skip links, and accessible `<dialog>` modals. |
| 1.4.3 Contrast (Minimum) | Supports | Dark `#111827` / `#1f2937` text on `#ffffff`, `#0052a3` primary buttons with `#ffffff` text, and `#b00020` error text exceed 4.5:1. |
| 1.4.4 Resize text / 1.4.10 Reflow | Supports | All component spacing and font sizes use `rem`; single-column responsive layout supports 320 CSS px width and 200% zoom without horizontal scrolling. |
| 1.4.11 Non-text contrast | Supports | Interactive borders on `.choice-label-row` (`#6b7280`, ~4.83:1 on `#ffffff`) and `.btn-secondary` (`#4b5563` on `#e5e7eb`) meet >= 3:1 UI component contrast. |
| 2.1.1 Keyboard | Supports | Native `<input type="radio">`, `<input type="checkbox">`, `<select>`, and `<button>` elements support Tab, Shift+Tab, Enter, Space, Escape (`<dialog>`), and arrow keys (`role="tablist"` in `demo/auth.html`). |
| 2.2.1 Timing adjustable | Supports | No session timers, no auto-closing job application dialogs, no expiring OTPs, and no CAPTCHAs. Drafts and UI presets persist locally. |
| 2.4.3 Focus order | Supports | Advancing/returning steps moves focus to the step heading (`tabindex="-1"`); completion moves focus to `#completion-title`. |
| 2.4.7 Focus visible / 2.4.11 Focus not obscured | Supports | `:focus-visible` renders a `3px solid #f5a300` outline with `2px` offset on every interactive control; no sticky overlays cover controls. |
| 2.5.8 Target size (Minimum) | Supports | All buttons, inputs, and choice rows have `min-height: 2.75rem` (44 px). |
| 3.1.2 Language of parts | Supports | `<form lang="am">` / `lang="en"` and `document.documentElement.lang` update dynamically so screen readers switch voices cleanly. |
| 3.3.1 Error identification / 3.3.3 Error suggestion | Supports | Text errors rendered beside fields with `role="alert"`, `aria-invalid="true"`, `aria-describedby`, spoken error alert, and focus sent to the invalid field across registration, `mode="signin"`, consent validation, and `demo/auth.html`. |
| 4.1.2 Name, role, value / 4.1.3 Status messages | Supports | `aria-live="polite"` progress/status announcements and `aria-pressed` on toolbar toggles; voice note playback preview available before submission. |
| 1.2.x Media / Recorded audio fallback | Partly | Browser `speechSynthesis` (3-tier Amharic/English fallback) + synchronized word highlighting + `audio-base` MP3 hook implemented; pre-recorded human Amharic `.mp3` clips are not yet recorded for devices lacking an Amharic system TTS voice. |

## Test Log & Assistive Tech Verification (§11)

- **Automated accessibility check (`npm run test:a11y`)**:
  - **Tool**: `axe-core` (`^4.14.0`, WCAG 2.0/2.1/2.2 A & AA rules) running in JSDOM against rendered pages and Shadow DOM `<db-signup>` hosts (`color-contrast` JS layout check disabled in JSDOM; contrast ratios verified directly against CSS hex palette above).
  - **Results**:
    - `demo/blank.html`: **0 critical/serious, 0 total violations**
    - `demo/jobs.html`: **0 critical/serious, 0 total violations**
    - `demo/auth.html`: **0 critical/serious, 0 total violations**
    - `savanna/index.html`: **0 critical/serious, 0 total violations**
    - `savanna/pages/signup.html`: **0 critical/serious, 0 total violations**
    - `savanna/pages/profile.html`: **0 critical/serious, 0 total violations**
    - `savanna/pages/jobs.html`: **0 critical/serious, 0 total violations**
    - `savanna/pages/homepage-v1-paced.html`: **0 critical/serious, 0 total violations**
    - `savanna/pages/homepage-v1-self-paced.html`: **0 critical/serious, 0 total violations**
    - `savanna/pages/concept-with-navigation.html`: **0 critical/serious, 0 total violations**
- **Automated unit, keyboard-DOM & database suite (`npm test`)**: **29/29 passing** across phone validation/normalization, EN/AM spoken digits, `StepEngine` privacy separation, `signinFlow`, consent recording, EN/AM locale parity, classic-script bundle verification, Savanna learner homepage card keyboard navigation (`tests/homepage-keyboard.test.js`), and database/data-ownership tests.
- **Pending live assistive-tech & device sign-off (requires physical devices outside container)**:
  - **Tester / Device / Screen Reader**: *Pending* — unassisted co-designer walkthrough on a low-cost Android phone over HTTPS (`cloudflared` / `ngrok`) with **Android TalkBack** and **Windows NVDA**, plus Chrome DevTools **Slow 3G** cold-load measurement and verification of any step where the co-designer hesitated or needed help.
