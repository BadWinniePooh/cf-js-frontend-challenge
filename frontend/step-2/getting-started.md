# Getting started — Step 2

Run these steps once **before** the [Step 2 README](./README.md) (Connections and onward).

## 1) Branch

Work on a branch from Step-1 so feedback and history stay easy to follow.

## 2) Serve this folder over HTTP

`index.html` loads ES modules (`index.js` imports **Step 1’s** `cfb-tag.js`). Browsers block modules on `file://`.

From **`frontend`** (this allows you easily change between /step-1/index.html and /step-2/index.html:

**Option A — one-off:**

```bash
cd frontend
npx http-server -o .
```

**Option B — global `http-server`:**

```bash
npm install -g http-server
cd frontend
http-server . -o
```

Then open `http://localhost:8080/ -> you have a direct link to the Step 2 folder.

## 3) Verify in the browser

Open the served page. You should see the Step 2 header and at least one session card area (your implementation may start
empty until `cfb-session-card.js` is wired).

Open DevTools → **Console**. Fix **module resolution errors** before continuing — `index.js` imports `../step-1/cfb-tag.js`;
keep folder layout (`step-1/` next to `step-2/`) or adjust the import path if your clone differs.

---

[Continue to Step 2 →](./README.md)
