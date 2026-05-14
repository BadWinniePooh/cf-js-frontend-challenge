# Getting started — Step 7

Run these steps once **before** the [Step 7 README](./README.md) (Connections and onward).

## 1) Branch

Work on a branch so feedback and history stay easy to follow.

## 2) Serve from the `frontend/` folder (important)

[`index.html`](./index.html) links **`../styles.css`**. Serve the **`frontend`** directory as the site root (not only `step-7/`), then open **`step-7/index.html`**.

From **`frontend/`**:

```bash
npx http-server -o .
```

Then browse to **`/step-7/index.html`** (exact path depends on the tool; with `-o` you may need to navigate once).

**`index.js`** loads ES modules from **`step-7/`** and imports **`../step-1/`** … **`../step-6/`**. Browsers block modules on **`file://`**.

Open DevTools → **Console** and fix import errors before continuing.

## 3) Choose how HTTP responses are provided

Pick **one** path for this week (you can try the other later):

### Option A — Real API (`step-7-be`)

The app’s default base URL is **`http://localhost:3001`** (see [`lib/api/backend-api.js`](./lib/api/backend-api.js)).

From **`frontend/step-7-be/`**:

```bash
npm install
npm start
```

Leave **MSW** commented out in [`index.js`](./index.js) (as in this repo by default). **`fetch`** hits the real server.

### Option B — MSW in the browser (no backend process)

1. In **`frontend/step-7/`**, install MSW (use **`npm`** or **`yarn`** — a lockfile may already exist):

   ```bash
   npm init -y
   npm install msw --save-dev
   ```

2. Generate the worker script (once):

   ```bash
   npx msw init . --save
   ```

   You should have **`mockServiceWorker.js`** next to **`index.html`** (or adjust paths per [MSW docs](https://mswjs.io/docs/integrations/browser)).

3. In [`index.js`](./index.js), **uncomment** the MSW bootstrap so **`worker.start()`** runs **before** custom elements
   load — the first **`fetch`** must already be intercepted.

4. Keep **`configureBackendApi({ baseUrl: 'http://localhost:3001' })`** aligned with the origin passed into 
   [`mocks/handlers.js`](./mocks/handlers.js) / [`mocks/browser.js`](./mocks/browser.js) so handler URLs match.

**IndexedDB** is tied to **origin** (scheme + host + port). Use a stable URL while you debug.

---

[Continue to Step 7 →](./README.md)
