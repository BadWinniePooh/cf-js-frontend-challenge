# Learning log - Step 8

Use this file while you work through [Step 8 README](./README.md). When you finish the step, add your **key takeaway**
in the [journey hub `learning-log.md`](../learning-log.md#step-8-key-takeaway).

---

<a id="step-8-connections-push-vs-pull"></a>

### Step 8 - Connections: Push vs pull (think → ink)

_Solo, ~2 minutes. Answer **before** you read Concepts._

You have index.html open in 2 different browser windows. In one of the browser windows, you click
**“Add random session (via backend)”**.

**In one or two sentences:** What happens in the background? And why does the new session appear on the other
browser window web page immediately?

>

_(You will [loop back](#step-8-loop-back-push-vs-pull) in Conclusions.)_

---

<a id="step-8-bridge-step-7"></a>

### Step 8 - Connections: Bridge from Step 7

_Solo, ~4 minutes._

Step 7’s **`<cfb-session-loader>`** both **fetched** and **wrote** IndexedDB. And
the `cfb-updates-sessions` triggered an event to initiate a new **pull** for data.

**Two bullets:**

1. **Why** are we changing this now? What might be the benefits?
2. How would `cfb-updates-sessions` change within step-8

>

---

<a id="step-8-connections-surprise"></a>

### Step 8 - Connections: Surprise (solo or pair)

_~3 minutes._

Think of one real-time product you use (chat, Figma, sports scoreboard, …) - one line: is it mostly **push**, **poll**,
or **both**?

>

---

<a id="step-8-topic-link"></a>

### Step 8 - Connections: Topic link

_Solo, ~2 minutes. Answer **A** or **B** - not both._

**A)** Why does the WebSocket URL include **`eventId`** (`/ws/sessions/codefreeze-2025`) instead of one global
feed for all conferences?

>

**B)** In one sentence: what goes wrong if **`cfb-live-session-updates`** imports **`saveSessions`** directly instead
of dispatching an event to the store wrapper? The responsibility of the said component is to listen to the WebSocket
for updates.

>

---

[← Back to README - 2) Concepts](./README.md#2-concepts)

---

<a id="step-8-concepts-one-minute"></a>

### Step 8 - Concepts: One-minute review

_After reading the README Concepts sections - ~1 minute._

**Two bullets:**

1. What are the benefits of introducing WebSockets into CfbBoard?
2. Think what are the added complexity of the WebSockets - and how would you test that?

>

---

<a id="step-8-concept-quiz"></a>

### Step 8 - Concept check: Mini quiz

_Answer **from memory first** (~4 minutes). Then peek at the README or source if needed._

1. What are the 4 important lifecycle hooks for a web socket connection? 

   > ___

2. Why did we split responsibilities between fetching data and storing that into IndexedDB?

   > ___

3. When is the websocket connected? When is it disconnected?

   > ___

---

<a id="step-8-concept-two-path-sketch"></a>

### Step 8 - Concept check: Two-path sketch (visual)

_Solo, ~5 minutes. 

Draw **two** parallel swimlanes labelled **PULL** and **PUSH**.

Each lane needs **at least four boxes** ending at **`cfb-schedule` re-render**.

Label **one arrow** per lane with the key event or attribute (e.g. **`sessionsFetched`**, **`sessionsLoaded`**, *
*`data-latest-updated-at`**).

> _(paste a photo link, ASCII sketch, or short description of your drawing)_

> ___

---

[← Back to README - 3) Concrete practice](./README.md#3-concrete-practice)

---

<a id="step-8-concrete-facilitator-question"></a>

### Step 8 - Concrete practice: Question for your facilitator

_Solo, ~5 minutes._

Ask **one** question about **WebSockets**, **the store wrapper pattern**, **orchestrator incremental refresh**, or *
*testing push without a real server**. Paste their reply (or your notes) below.

**My question**

> ___

**Facilitator reply / notes**

> ___

---

[← Back to README - 4) Conclusions](./README.md#4-conclusions)

---

<a id="step-8-conclusions-quick-check"></a>

### Step 8 - Conclusions: Quick check

_~4 minutes._

1. What is the full WebSocket URL for **CodeFreeze 2025** with default **`step-8-be`**?

   > ___

2. Open **two tabs** on the same event. Click **add random session** in tab A. What do you observe in tab B - and which
   message **`type`** did the socket deliver?

   > ___

3. Point to the file where **`cfb-updates-sessions`** handles **Remove** → backend **DELETE**.

   > ___

---

<a id="step-8-loop-back-push-vs-pull"></a>

### Step 8 - Conclusions: Loop back - push vs pull

_Look at your answer under [Push vs pull](#step-8-connections-push-vs-pull). Correct it in one line: what was wrong?_

> ___

---


### Step 8 - Conclusions: Susprises 

Thinking of working with WebSockets, what things surprised you?

> ___

Thinking of the whole 8-step process, what things surprised you?

> ___

---

### Step 8 - Conclusions: Ticket out

_Short reflection._

1. **Best thing in this journey** (one sentence):

   >

2. **What could be improved** how can the whole journey be better

   >

---

[← Journey hub (key takeaways)](../learning-log.md)
