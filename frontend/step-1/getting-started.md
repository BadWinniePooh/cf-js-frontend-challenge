# Getting started - Step 1

Run these steps once **before** the [Step 1 README](./README.md) (Connections and onward).

## 1) Branch

Create a branch (or continue same from step-0) for your work so feedback and history stay easy to follow.

## 2) Serve this folder over HTTP

`index.html` loads `index.js` as an ES module (`type="module"`). Browsers block that on `file://`, so use a local server from **`frontend/step-1`** (or your copy of this folder).

**Option A - one-off:**

```bash
cd frontend/step-1
npx http-server -o .
```

**Option B - global `http-server`:**

```bash
npm install -g http-server
cd frontend/step-1
http-server . -o
```

**Option C - VS Code:** [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) → right-click `index.html` → *Open with Live Server*.

## 3) Verify in the browser

Open the served page. You should see the Step 1 header and a row of chip-style tags (a mix of `<cfb-tag>` and static `<span class="cfb-tag …">` placeholders is normal until you finish the exercise).

If the page is blank or the console shows module errors, fix the server path or imports **before** diving into lifecycle details.

---

[Continue to Step 1 →](./README.md)
