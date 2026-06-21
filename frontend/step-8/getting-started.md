# Getting started - Step 8

Run these steps once **before** the [Step 8 README](./README.md) (Connections and onward).

## 1) Branch

Work on a branch so feedback and history stay easy to follow.

## 2) Serve from the `frontend/` folder 

[`index.html`](./index.html) links **`../styles.css`**. Serve the **`frontend`** directory as the site root (not only `step-8/`),
then open **`step-8/index.html`**.

From **`frontend/`**:

```bash
npx http-server -o .
```

Then browse to **`/step-8/index.html`**.

## 3) Start the Step 8 backend (required)

This week assumes **`step-8-be`** is running - WebSocket push and the random-session button depend on it.

From **`frontend/step-8-be/`**:

```bash
yarn install
yarn start
```

You should see HTTP on **`http://localhost:3001`** and a WebSocket URL like:

`ws://localhost:3001/ws/sessions/codefreeze-2025`

Leave **`configureBackendApi({ baseUrl: 'http://localhost:3001' })`** in [`index.js`](./index.js) as-is unless you changed the port.

## 4) Quick smoke test

1. Open **`step-8/index.html`** in the browser.
2. Confirm the **live-updates** element shows **`open`** (green styling).
3. Click **“Add random session (via backend)”** - a new card should appear **without** reloading the page.
4. Open the same URL in a **second tab** - click the button in one tab; the other tab should update too.

If the WebSocket element stays **`error`** or **`closed`**, check that **`step-8-be`** is running and that nothing else is bound to port **3001**.

---

[Continue to Step 8 →](./README.md)
