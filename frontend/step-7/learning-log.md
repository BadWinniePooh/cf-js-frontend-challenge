# Learning log — Step 7

Use this file while you work through [Step 7 README](./README.md). When you finish the step, add your **key takeaway** in 
the [journey hub `learning-log.md`](../learning-log.md#step-7-key-takeaway).

This step uses **Training from the Back of the Room** ideas adapted for **solo / async**: **different** prompt types, 
**writing** and a small **sketch**, and **short** timeboxes. Follow the **order** in the README.

---

<a id="step-7-connections-first-fetch"></a>

### Step 7 — Connections: First fetch (think → ink)

_Solo, ~2 minutes. Answer **before** you read Concepts._

You click **“CodeFreeze 2025”** (or the page loads with **`data-event-id`** already set). Two loaders run.

**In one or two sentences:** what do you think happens **first** in the browser — **`cfb-schedule`** paints cards, 
loaders **`fetch`**, MSW (if enabled) answers, or IndexedDB is read? Number them **1–4** in your guessed order.

>

| order | situation                       |
|-------|---------------------------------|
| 4     | **`cfb-schedule`** paints cards |
| 1     | loaders **`fetch`**,            |
| 3     | MSW (if enabled) answers        |
| 2     | IndexedDB is read               |


_(You will [loop back](#step-7-loop-back-first-fetch) in Conclusions.)_

---

<a id="step-7-bridge-step-4-6"></a>

### Step 7 — Connections: Bridge from Step 4–6

_Solo, ~4 minutes._

Step 4–6 already wrote sessions to **IndexedDB** and refreshed **`cfb-schedule`** via signals and attributes.

**What is new** when data comes from **`fetch`** + a small API layer instead of only in-page events? Two bullets: 
one **similarity** (what stays the same), one **difference** (what’s new).

> - **Similarity:** Both are asynchronous and non-blocking.
> - **Difference:** Fetch requires network communication (HTTP request to a different server), whereas in-page events are part of the DOM and work within the client.

---

<a id="step-7-connections-surprise"></a>

### Step 7 — Connections: Surprise (solo) or compare (pair)

_~3 minutes._

**Solo:** One thing about **`fetch`**, **CORS**, or **mocking** that has burned you before — one line.

**If you compare later:** where will you look first when a loader shows **error** — **Console**, **Network**, or 
**Application → IndexedDB**?

> Look first at DevTools Console. CORS — always forget, always need to research how to set up correctly.

---

<a id="step-7-topic-link"></a>

### Step 7 — Connections: Topic link

_Solo, ~2 minutes. Answer **A** or **B** — not both._

**A)** Name one tool or pattern (Postman, contract tests, OpenAPI, …) teams use when the backend is **late**. 
One line: how does MSW relate?

> OpenAPI to define and share contract for API endpoints and data structures. MSW mocks the contract enabling the frontend to implement "full" functionality without waiting for the real backend.

**B)** In one sentence: why might you **not** want **`import { worker } from 'msw/…'`** inside **`cfb-session-loader.js`**?

> 

---

<a id="step-7-concepts-one-minute"></a>

### Step 7 — Concepts: One-minute review

_After reading the README Concepts sections — ~1 minute._

**Two bullets:**

1. **`res.ok`** — in one line, what do you do when it is **`false`**?
2. Loader vs schedule: who should **own** **`fetch`**, and who should **own** “paint cards from IDB”?

> 

---

<a id="step-7-concept-quiz"></a>

### Step 7 — Concept check: Mini quiz

_Answer **from memory first** (~4 minutes). Then peek at the README or [`cfb-board-orchestrator.js`](./cfb-board-orchestrator.js) if needed._

1. Which **two** **`CustomEvent`** **type strings** (event names) must the orchestrator treat as “initial load pair 
   complete” before it bumps **`data-latest-updated-at`** on **`.listens-schedule-updates`**?

   > 

2. Why do the loaders use **`bubbles: true`** (and **`composed: true`** in this repo) on those events?

   > 

3. What does **`attributeChangedCallback`** on **`cfb-schedule`** **not** receive from the parent — i.e. what does the
   schedule still have to **read** itself after the attribute changes?

   > 

---

<a id="step-7-concept-flow-sketch"></a>

### Step 7 — Concept check: Flow sketch (visual)

_Solo, ~4 minutes. Training from the Back of the Room — “images / different activity.”_

Draw **six boxes** in a row. Example chain (yours can merge “parallel loaders” into one box):

**event / `data-event-id`** → **both loaders** (parallel **`fetch`**) → **IndexedDB writes** → **orchestrator** → **`cfb-schedule` + re-render**.

Add **one short label** on each **arrow** (e.g. **`scheduleLoaded`**, **`data-latest-updated-at`**).

> 

---

<a id="step-7-concrete-facilitator-question"></a>

### Step 7 — Concrete practice: Question for your facilitator

_Solo, ~5 minutes._

Ask **one** question about **`fetch`**, **MSW**, **loader vs orchestrator responsibilities**, or **testing APIs without a backend**. Paste their reply (or your notes) below.

**My question**

> 

**Facilitator reply / notes**

> 

---

<a id="step-7-conclusions-quick-check"></a>

### Step 7 — Conclusions: Quick check

_~4 minutes._

1. Point to the file(s) where **`GET /api/schedule/:eventId`** and **`GET /api/sessions/:eventId`** are defined for **local mocking** — or the real server routes if you used **`step-7-be`**.

   > 

2. In one line: what is the **single attribute** the orchestrator writes so **`cfb-schedule`** knows to **re-pull** sessions from IndexedDB?

   > 

---

<a id="step-7-loop-back-first-fetch"></a>

### Step 7 — Conclusions: Loop back — first fetch

_Look at your answer under [First fetch](#step-7-connections-first-fetch). Update the ordering in one line: what was wrong?_

> 

---

<a id="step-7-conclusions-msw-benefit"></a>

### Step 7 — Conclusions: MSW outside components

_From [`../PLAN.md`](../PLAN.md) — one benefit._

Write **one** concrete benefit of keeping **MSW** (or any mock worker bootstrap) **out of** **`cfb-session-loader.js`** / **`cfb-schedule-loader.js`** — one or two sentences.

>

---

<a id="step-7-conclusions-tf-coordination"></a>

### Step 7 — Conclusions: True / False — coordination

**Statement:** “Loader completion events can coordinate rendering **without** components importing each other’s classes.”

**True or false?** One sentence why.

> 

---

<a id="step-7-conclusions-tf-mocks-removed"></a>

### Step 7 — Conclusions: True / False — mocks removed

**Statement:** “If mocks are removed, components **must** be rewritten to use real APIs.”

**True or false?** One sentence why.

> 

---

[← Journey hub (key takeaways)](../learning-log.md)
