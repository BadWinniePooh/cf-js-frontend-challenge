# Getting started — Step 6

Run these steps once **before** the [Step 6 README](./README.md) (Connections and onward).

## 1) Branch

Work on a branch so feedback and history stay easy to follow.

## 2) Serve this folder over HTTP

`step-6/index.js` loads ES modules from **`step-6/`** and imports **`../step-5/`**, **`../step-4/`**, and **`../step-1/`**. Browsers block modules on `file://`.

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

**Option C — VS Code:** [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) → right-click `step-6/index.html` → *Open with Live Server*.

## 3) Verify in the browser

Open the served Step 6 page. You should see the board with **+ Add Session** and working add/edit flows from Step 5 as your baseline.

Open DevTools → **Console**. Fix **module** errors before continuing — imports from **`step-5`**, **`step-4`**, and **`step-1`** must resolve.

**IndexedDB** is still tied to **origin** (scheme + host + port). Use the same URL each time you test so earlier steps’ data and new writes land in the same database.

---

[Continue to Step 6 →](./README.md)
