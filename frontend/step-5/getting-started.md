# Getting started — Step 5

Run these steps once **before** the [Step 5 README](./README.md) (Connections and onward).

## 1) Branch

Work on a branch so feedback and history stay easy to follow.

## 2) Serve this folder over HTTP

`index.js` loads ES modules from **`step-5/`** and imports **`../step-4/`**, **`../step-2/`**, and **`../step-1/`**. Browsers block modules on `file://`.

From **`frontend`**:

**Option A — one-off:**

```bash
npx http-server -o .
```

**Option B — global `http-server`:**

```bash
npm install -g http-server
http-server . -o
```

**Option C — VS Code:** [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) → right-click `step-5/index.html` → *Open with Live Server*.

## 3) Verify in the browser

Open the served page. You should see the Step 5 header and the board with **+ Add Session** (not only a random generator).

Open DevTools → **Console**. Fix **module** errors before continuing — this step expects imports from **`step-4`**, **`step-2`**, and **`step-1`** to resolve.

**IndexedDB** is still tied to **origin** (scheme + host + port). Use the same URL each time you test so Step 4 data and Step 5 writes land in the same database.

---

[Continue to Step 5 →](./README.md)
