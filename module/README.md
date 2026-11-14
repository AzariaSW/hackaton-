# Digital Bridge Accessible Onboarding Module (`<db-signup>`)

A lightweight, dependency-free Web Component for learning platforms and job boards.

## Installation

### Level 1: Drop-in Web Component (No Backend Required)

```html
<!DOCTYPE html>
<html lang="am">
<head>
  <meta charset="UTF-8">
  <title>My Platform</title>
</head>
<body>
  <script src="/module/db-signup.js" defer></script>
  <db-signup lang="am" mode="registration"></db-signup>
</body>
</html>
```

### Attributes

- `lang`: Language code (`en`, `am`, or any drop-in `locales/<lang>.json`; default `en`)
- `mode`: Flow type (`registration`, `signin`, `profile-edit`, `job-apply`; default `registration`)
- `api`: Optional API base URL for Level 2 integration (`/api` or origin URL)
- `theme`: Optional theme identifier
- `audio-base`: Optional base path for pre-recorded MP3 clips (`{audioBase}/{lang}/{clipKey}.mp3`)

### Events

```javascript
// Registration/profile completion (never includes support preferences)
document.addEventListener('db-signup:done', (event) => {
  console.log('Completed:', event.detail); // includes consent: { accepted, recordedAt }
});

// Support preferences (strictly separated)
document.addEventListener('db-signup:support', (event) => {
  console.log('Accessibility preferences:', event.detail);
});

// Returning learner sign-in (mode="signin")
document.addEventListener('db-signup:signin', (event) => {
  console.log('Sign-in payload:', event.detail);
});
```

## Development

```bash
npm install
npm run build
npm run dev
# Open http://localhost:3000/demo/blank.html
# Or Savanna proof: http://localhost:3000/savanna/pages/signup.html
```

## License

MIT
