# Learning log — Step 8

Use this file while you work through [Step 8 README](./README.md). When you finish the step, add your **key takeaway** in the
[journey hub `learning-log.md`](../learning-log.md#step-8-key-takeaway).

This step uses **Training from the Back of the Room** ideas adapted for **solo / async**: **different** prompt types,
**writing** and a small **sketch**, and **short** timeboxes. Follow the **order** in the README.

**Prerequisite:** [`step-8-be`](../step-8-be/README.md) running on port **3001** (see [getting-started.md](./getting-started.md)).

---

<a id="step-8-connections-push-vs-pull"></a>

### Step 8 — Connections: Push vs pull (think → ink)

_Solo, ~2 minutes. Answer **before** you read Concepts._

A colleague clicks **“Add random session (via backend)”** while you watch the board.

**In one or two sentences:** does the new card appear because **`cfb-schedule`** called **`fetch`**, 
because a **WebSocket message** arrived, or because **`FormData`** submitted? 
Name the **first** mechanism you think fires.

>

_(You will [loop back](#step-8-loop-back-push-vs-pull) in Conclusions.)_

---

<a id="step-8-bridge-step-7"></a>

### Step 8 — Connections: Bridge from Step 7

_Solo, ~4 minutes._

Step 7’s **`<cfb-session-loader>`** both **fetched** and **wrote** IndexedDB.

**Two bullets:**

1. **Why this might be a design smell**? 
2. **How would you change it**? 

>

---

<a id="step-8-connections-surprise"></a>

### Step 8 — Connections: Surprise (solo) or compare (pair)

_~3 minutes._

**Solo:** One real-time product you use (chat, Figma, sports scoreboard, …) — one line: is it 
mostly **push**, **poll**, or **both**?

**If you compare later:** what broke first when you tested — **HTTP**, **WebSocket**, or **IndexedDB**?

>

---

<a id="step-8-topic-link"></a>

### Step 8 — Connections: Topic link

_Solo, ~2 minutes. Answer **A** or **B** — not both._

**A)** How can you make sure you only listen to the relevant stream of events (of relevant conference)?

>

**B)** In one sentence: what is WebSocket and why do we use it? (wrong answers is also good - we'll get back
to this at the end of the step) 

>

---

<a id="step-8-concepts-one-minute"></a>

### Step 8 — Concepts: One-minute review

_After reading the README Concepts sections — ~1 minute._

**Two bullets:**

1. Who should **own** closing the WebSocket — the live component, the orchestrator, or **`cfb-schedule`**?
2. After a **`sessionUpdated`** message, which **one** event type does the store emit so the orchestrator can 
   refresh the schedule (same as Step 7’s loader completion)?

>

---

<a id="step-8-concept-quiz"></a>

### Step 8 — Concept check: Mini quiz

_Answer **from memory first** (~4 minutes). Then peek at the README or source if needed._

1. Name the **three** inbound event types **`cfb-session-store-updates`** listens for (exact strings).

   >

2. What does **`cfb-session-loader`** dispatch **instead of** writing IndexedDB in Step 8?

   >

3. **`cfb-updates-sessions`** handles **`cfb-session-created`**, **`cfb-session-updated`**, and **`cfb-session-removed`**. Which of those use the **WebSocket** path?

   >

4. Why does **`cfb-initiate-a-random-session-creation`** only **`POST`** to the API and **not** call **`saveSessions`** locally?

   >

---

<a id="step-8-concept-two-path-sketch"></a>

### Step 8 — Concept check: Two-path sketch (visual)

_Solo, ~5 minutes. Training from the Back of the Room — “images / different activity.”_

Draw **two** parallel swimlanes labelled **PULL** and **PUSH**.

Each lane needs **at least four boxes** ending at **`cfb-schedule` re-render**.

Label **one arrow** per lane with the key event or attribute (e.g. **`sessionsFetched`**, **`sessionsLoaded`**, **`data-latest-updated-at`**).

> _(paste a photo link, ASCII sketch, or short description of your drawing)_

>

---

<a id="step-8-concrete-facilitator-question"></a>

### Step 8 — Concrete practice: Question for your facilitator

_Solo, ~5 minutes._

Ask **one** question about **WebSockets**, **the store wrapper pattern**, **orchestrator incremental refresh**, or **testing push without a real server**. Paste their reply (or your notes) below.

**My question**

>

**Facilitator reply / notes**

>

---

<a id="step-8-conclusions-quick-check"></a>

### Step 8 — Conclusions: Quick check

_~4 minutes._

1. What is the full WebSocket URL for **CodeFreeze 2025** with default **`step-8-be`**?

   >

2. Open **two tabs** on the same event. Click **random session** in tab A. What do you observe in tab B — and which message **`type`** did the socket deliver?

   >

3. Point to the file where **`cfb-updates-sessions`** handles **Remove** → backend **DELETE**.

   >

---

<a id="step-8-loop-back-push-vs-pull"></a>

### Step 8 — Conclusions: Loop back — push vs pull

_Look at your answer under [Push vs pull](#step-8-connections-push-vs-pull). Correct it in one line: what was wrong?_

>

---

<a id="step-8-conclusions-pull-vs-push"></a>

### Step 8 — Conclusions: Pull vs push in this app

_From [`../PLAN.md`](../PLAN.md) — two sentences._

Describe the **pull** path (loader or form → … → schedule) and the **push** path (WebSocket → … → schedule) in **your own words**.

>

---

<a id="step-8-conclusions-tf-close-socket"></a>

### Step 8 — Conclusions: True / False — close socket

**Statement:** “A live component should close its WebSocket in **`disconnectedCallback`** when it is removed from the DOM.”

**True or false?** One sentence why.

>

---

<a id="step-8-conclusions-tf-render-path"></a>

### Step 8 — Conclusions: True / False — separate render path

**Statement:** “Real-time updates in this step require a **separate** rendering path from the Step 7 schedule.”

**True or false?** One sentence why.

>

---

[← Journey hub (key takeaways)](../learning-log.md)
