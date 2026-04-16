# Finding seams — JavaScript

Same exercises as the [parent README](../README.md). Code is **ES modules** under `src/`; tests use **Mocha** and **Chai** in `test/`.

## Prerequisites

- **Node.js** (current LTS is a good choice)
- **Yarn** classic (v1) or **npm**

## Setup

From this directory (`02-finding-seams/javascript/`):

```bash
yarn install
# or: npm install
```

## Run tests

```bash
yarn test
# or: npm test
```

Run one file:

```bash
yarn test test/6-reminder-sender.test.js
# or: npx mocha test/6-reminder-sender.test.js
```

Most suites use `describe.skip` so they stay out of the way until you work on them; one test is meant to run as-is (reminder sender).

## Lint

```bash
yarn lint
yarn lint:fix
```

`eslint.config.mjs` expects the shared config package listed in `package.json`. If `yarn install` cannot fetch it (for example offline), fix or replace that dependency before `yarn lint` will work.

## Other scripts

| Command | Purpose |
|---------|---------|
| `yarn clean` | Remove `dist/` |

## Layout

| Test file | Roughly maps to |
|-----------|------------------|
| `test/1-speaker-feedback.test.js` | Speaker feedback |
| `test/2-badge-printer.test.js` | Badge printing |
| `test/3-room-availability.test.js` | Room availability |
| `test/5-schedule-to-text.test.js` | Schedule → text |
| `test/6-reminder-sender.test.js` | Reminder sender |

Source mirrors those names under `src/` (for example `src/speaker-feedback/`, `src/badge-printing/`).
