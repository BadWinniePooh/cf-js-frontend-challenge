# Getting started - Step 4

Run these steps once **before** the [Step 4 README](./README.md) (Connections and onward).

## 1) Branch

Work on a branch so feedback and history stay easy to follow.

## 2) Serve this folder over HTTP

From **`frontend`**:

**Option A - one-off:**

```bash
npx http-server -o .
```

**Option B - global `http-server`:**

```bash
npm install -g http-server
http-server . -o
```

## 3) Verify in the browser

Open the served page. You should see the Step 4 header and the board area with text 'No sessions yet'

Open DevTools → **Console**. Fix **module** errors before continuing - this step expects **`step-1/`**, **`step-2/`**,
and **`step-3/`** paths from [`index.js`](./index.js) to resolve.

---

[Continue to Step 4 →](./README.md)
