# Getting started - Step 0

Run these steps once **before** the [Step 0 README](./README.md) (Connections and onward).

## 1) Branch

Create a branch for your work so feedback and history stay easy to follow.

## 2) Serve this folder (recommended)

This step is **HTML and CSS only** - no JavaScript. Some browsers still render `index.html` reasonably well from 
`file://`, but a tiny local server matches how you will work from Step 1 onward and avoids odd `file://` quirks with assets.

From **`frontend/step-0`** (or your copy of this folder):

**Option A - one-off:**

```bash
cd frontend/step-0
npx http-server -o .
```

**Option B - global `http-server`:**

```bash
npm install -g http-server
cd frontend/step-0
http-server . -o
```

**Option C - VS Code:** [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) → right-click `index.html` → *Open with Live Server*.

## 3) Verify in the browser

Open the served page. You should see:

- a top **header** / navigation area,
- several **day columns** (Mon–Sun style layout),
- **session cards** with titles, coloured tag chips, and attendee avatars.

If styles look wrong, confirm the server was started from `step-0/` so `../styles.css` resolves correctly.

---

[Continue to Step 0 →](./README.md)
