# Getting started - Step 4

Run these steps once **before** the [Step 4 README](./README.md) (Connections and onward).

## 1) Branch

Work on a branch so feedback and history stay easy to follow.

## 2) Serve this folder over HTTP

`index.js` loads ES modules from **`step-4/`** and imports **`../step-1/`**, **`../step-3/`**, and local components. Browsers block modules on `file://`.

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

**Option C - VS Code:** [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) → right-click `index.html` → *Open with Live Server*.

## 3) Verify in the browser

Open the served page. You should see the Step 4 header and the board area (loader + session store + schedule).

Open DevTools → **Console**. Fix **module** errors before continuing - this step expects **`step-1/`**, **`step-2/`**, and **`step-3/`** paths from [`index.js`](./index.js) to resolve.

**IndexedDB** is tied to **origin** (scheme + host + port), like `localStorage`. Use the same origin each time you test (same URL as your dev server).

---

[Continue to Step 4 →](./README.md)
