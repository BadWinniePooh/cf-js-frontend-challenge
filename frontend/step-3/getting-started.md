# Getting started - Step 3

Run these steps once **before** the [Step 3 README](./README.md) (Connections and onward).

## 1) Branch

Work on a branch so feedback and history stay easy to follow.

## 2) Serve this folder over HTTP

From **`frontend/`**:

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

Open the served page. You should see the Step 3 header and an orchestrator area with **Add random session** and a schedule region.

Open DevTools → **Console**. Fix any **module** errors first (`cfb-tag`, `cfb-session-card`, `events.js`, etc.). The repo expects **`step-1/`** and **`step-2/`** next to **`step-3/`**.

---

[Continue to Step 3 →](./README.md)
