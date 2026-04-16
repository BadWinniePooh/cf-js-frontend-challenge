# Finding seams — TypeScript

Same exercises as the [parent README](../README.md). Code lives under `src/`; tests are **Mocha** + **Chai** with **ts-node** (ESM) in `test/`.

## Prerequisites

- **Node.js** (current LTS is a good choice)
- **Yarn** classic (v1) or **npm**

## Setup

From this directory (`02-finding-seams/typescript/`):

```bash
yarn install
# or: npm install
```

## Run tests

```bash
yarn test
# or: npm test
```

This runs Mocha with `ts-node/register` and `test/register.js` (loads `ts-node/esm`).

Run one file:

```bash
yarn test -- test/6-reminder-sender.test.ts
# or: npx mocha -r ts-node/register --import=./test/register.js test/6-reminder-sender.test.ts
```

Most suites use `describe.skip`; one test (reminder sender) is intended to run without changes.

## Compile

Type-check / emit JavaScript:

```bash
yarn build
```

Type-check including tests (no emit to `dist/`):

```bash
yarn build:test
```

Watch mode:

```bash
yarn build:w
```

## Lint

```bash
yarn lint
yarn lint:fix
```

## Other scripts

| Command | Purpose |
|---------|---------|
| `yarn clean` | Remove `dist/` |

## Layout

| Test file | Roughly maps to |
|-----------|------------------|
| `test/1-speaker-feedback.test.ts` | Speaker feedback |
| `test/2-badge-printer.test.ts` | Badge printing |
| `test/3-room-availability.test.ts` | Room availability |
| `test/5-schedule-to-text.test.ts` | Schedule → text |
| `test/6-reminder-sender.test.ts` | Reminder sender |

Source packages live under `src/` (for example `src/speaker-feedback/`, `src/badge-printing/`).
