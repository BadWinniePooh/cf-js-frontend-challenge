# Learning log — Step 4

Use this file while you work through [Step 4 README](./README.md). When you finish the step, add your **key takeaway** in the [journey hub `learning-log.md`](../learning-log.md#step-4-key-takeaway).

---

[← Back to README — 1) Connections](./README.md#1-connections)

---

<a id="step-4-connections-refresh"></a>

### Step 4 — Connections: Refresh the page

_Solo, ~2 minutes. Answer **before** you read Concepts — a gut guess is fine._

After Step 3, sessions lived in memory on the orchestrator. **What happens to the board if you refresh the page?**
Why would putting sessions in **IndexedDB** change that?

> 

_(You will revisit this in Conclusions.)_

---

<a id="step-4-connections-orchestrator-step3"></a>

### Step 4 — Connections: Orchestrator from Step 3

_Solo, ~5 minutes._

In Step 3, **`cfb-board-orchestrator`** held **`#sessions`** and pushed **`data-sessions`** down. In this
step it **does not** hold session rows that way.

**List what the orchestrator still does here vs Step 3.** Then answer: **what would be “too much” responsibility** for
the orchestrator in a larger app? (One short paragraph.)

> 

---

<a id="step-4-bridge-step-3"></a>

### Step 4 — Connections: Bridge from Step 3

_Solo, ~3 minutes._

In one or two sentences: what stayed the same in the **event-up / attribute-down** idea from Step 3, and 
what changed now that **IndexedDB** exists?

> 

---

<a id="step-4-connections-surprise"></a>

### Step 4 — Connections: Surprise (solo) or compare (pair)

_~3 minutes._

If solo: *The IndexedDB API detail that surprised me most was ___.*

If you discussed with a peer: what will each of you try first in DevTools (**Application** tab)?

> 

---

<a id="step-4-topic-link"></a>

### Step 4 — Connections: Topic link

_Solo, ~2 minutes. Answer **A** or **B** — not both._

**A)** Where else have you seen **client-side persistence** (mobile, desktop, another web app)? One line.

> 

**B)** When is **localStorage** enough, and when would you reach for **IndexedDB** instead? One or two sentences.

> 

---

[← Back to README — 2) Concepts](./README.md#2-concepts)

---

<a id="step-4-concepts-one-minute"></a>

### Step 4 — Concepts: One-minute review

_After reading the README Concepts sections — ~1 minute._

In two bullets: **who reads IndexedDB** in this step’s architecture — and **who must not** mix UI and raw IDB calls?

> 

---

<a id="step-4-concept-quiz"></a>

### Step 4 — Concept check: Mini quiz

_Answer from memory first; then peek at [`session-store.js`](./session-store.js) or [`events.js`](./events.js) if needed._

1. In this repo, what **`DB_NAME`** constant does [`session-store.js`](./session-store.js) use when opening the database?

   > 

2. Why keep **`openDb` / `saveSessions` / `getAllSessions`** in **`session-store.js`** instead of calling 
   **`indexedDB.open`** directly inside **`cfb-schedule`**?

   > 

3. After data is ready in IndexedDB, **`cfb-session-loader`** dispatches which **event type string**? 
   *(See [`events.js`](./events.js).)*

   > 

---

[← Back to README — 4) Conclusions](./README.md#4-conclusions)

---

<a id="step-4-conclusions-quick-check"></a>

### Step 4 — Conclusions: Quick check

_Answer in your log — short phrases are enough._

1. Name **two files** that **import** from **`session-store.js`** (or list two consumers of **`getAllSessions`**).

   > 

2. What attribute does **`cfb-board-orchestrator`** set on **`listens-schedule-updates`** schedules, and why is it a
  **timestamp** rather than the full session array?

   > 

---

<a id="step-4-conclusions-ticket-out"></a>

### Step 4 — Conclusions: Ticket out

_Short reflection._

1. **Best thing so far in this journey** (one sentence):

   > 

2. **What could be improved** how can the whole journey be better (we're half-way):

   > 

---

<a id="step-4-loop-back-refresh"></a>

### Step 4 — Conclusions: Loop back — refresh the page

_Look at your answer under “Refresh the page.” Update in one or two lines if needed._

> 

---

[← Back to README — 3) Concrete practice](./README.md#3-concrete-practice)

---

<a id="step-4-facilitator-question"></a>

### Step 4 — Question for your facilitator

_Solo, ~5 minutes._

Ask **one** question about **IndexedDB**, **Promises + IDB**, or **splitting storage from UI**. Paste their reply (or your notes) below.

**My question**

> 

**Facilitator reply / notes**

> 

---

[← Journey hub (key takeaways)](../learning-log.md)
