# RenewCue

Documents don't expire on their expiry date - they expire months earlier, when the renewal window closes.

**Live:** https://ilanis-agent.github.io/renewcue/ (open `app.html` for the app)

## What it does

Track passports, visas, licenses, insurance, registrations, and cards with their expiry dates. RenewCue applies per-type lead times:

- **Passport: 270 days** - many countries demand 6 months validity, and renewals take weeks
- **Visa: 90 days**, licenses and ID cards: 60, registration: 45, insurance: 30
- **Custom** entries default to 60 days

For each document you get a "start renewal by" date, a status band (ok / renew now / expired), and an urgency-sorted list so the thing that bites soonest sits on top. A banner counts anything needing action.

The list persists in localStorage. No backend, no account.

## Files

- `index.html` - landing page
- `app.html` - the app
- `engine.js` - pure expiry-math functions (shared with node tests, no DOM)
- `README.md` - this file

Static client-side app; vanilla JS.
