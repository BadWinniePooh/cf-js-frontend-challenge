# Learning log - Step 3

Use this file while you work through [Step 3 README](./README.md). When you finish the step, add your **key takeaway** in
the [journey hub `learning-log.md`](../learning-log.md#step-3-key-takeaway).

---

<a id="step-3-connections-how-notify"></a>

### Step 3 - Connections: How does the button reach the board?

_Solo, ~2 minutes. Answer **before** you read Concepts - guess, don’t look at source yet._

**Without importing parent components**, how could a “Add session” control tell the rest of the page that a new session
exists? One or two sentences.

> 

_(You will revisit this in Conclusions.)_

---

<a id="step-3-bridge-step-2"></a>

### Step 3 - Connections: Bridge from Step 2

_Solo, ~3 minutes._

In Step 2, one card got data through **`data-session-details`**. In Step 3, **many** sessions appear and the list changes.
In one or two sentences: what has to change about **where** session data lives?

> 

---

<a id="step-3-connections-surprise"></a>

### Step 3 - Connections: Surprise (solo or pair)

_~3 minutes._

If solo: *The part of “events up, state down” I’m most unsure about is ___.*
If you discussed with a peer: one sentence each - what will you watch first in DevTools?

>

---

<a id="step-3-topic-link"></a>

### Step 3 - Connections: Topic link

_Solo, ~2 minutes. Answer **A** or **B** - not both._

**A)** Name a system you’ve used (UI framework, backend bus, message queue, game engine…) where something **mediates**
between producers and consumers. One line: what did the mediator **not** need to know?

>

**B)** In one sentence: how is a DOM **orchestrator** similar to or different from **lifting state up** in React?

>

---

[← Back to README - 2) Concepts](./README.md#2-concepts)

---

<a id="step-3-concepts-one-minute"></a>

### Step 3 - Concepts: One-minute review

_After reading the README Concepts sections - ~1 minute._

**Similarities / differences:** Compare “child fires an event, ancestor handles it” to one pattern you already know
(React props/callbacks, backend webhooks, anything). One similarity, one difference - bullet or two.

> 

---

<a id="step-3-concept-quiz"></a>

### Step 3 - Concept check: Mini quiz

_Answer from memory first; then peek at the README or source if needed._

1. What is the **event type string** this step uses when the generator dispatches? *(Hint: see [`events.js`](./events.js).)*

   > 

2. Why is **`bubbles: true`** (and often **`composed: true`**) important for the generator’s event?

   > 

3. How does state travel **down** to `<cfb-schedule>` - attribute name and what is serialized?

   > 

---

<a id="step-3-concept-flow-sketch"></a>

### Step 3 - Concept check: Flow sketch (visual)

_Solo, ~3 minutes. Draw a flowchart of events in a paper / ASCII

On paper or in ASCII here, draw **four boxes** in a row: **button click → generator → orchestrator → schedule**.
Add **very short note** on each **arrow** on what is the trigger (event, state change, etc)

>

---

[← Back to README - 3) Concrete practice](./README.md#3-concrete-practice)

---

<a id="step-3-concrete-facilitator-question"></a>

### Step 3 - Concrete Practice: Question to your Facilitator

_Solo, ~5 minutes._

Ask your facilitator **one** question about **pub/sub, bubbling, or orchestrators** - something you’re genuinely unsure
about after this step. Paste their reply (or your notes) below.

**My question**

>

**Facilitator reply / notes**

>

---

[← Back to README - 4) Conclusions](./README.md#4-conclusions)

---

<a id="step-3-conclusions-quick-check"></a>

### Step 3 - Conclusions: Quick check

_Answer in your log - short phrases are enough._

1. Where is the **`cfb-session-created`** event **defined** (file / constant name), and which component **dispatches** it?

   > 

2. In **one line**: what travels **up** the DOM vs **down** in this step?

   > 

---

<a id="step-3-loop-back-notify"></a>

### Step 3 - Conclusions: Loop back - how does the button reach the board?

_Look at your answer under [“How does the button reach the board?”](#step-3-connections-how-notify) Update in one or two lines if needed._

>

### Key takeaway (journey hub)

Add **one or two sentences** in the [journey hub `learning-log.md`](../learning-log.md#step-3--pubsub)

---

[← Journey hub (key takeaways)](../learning-log.md)
