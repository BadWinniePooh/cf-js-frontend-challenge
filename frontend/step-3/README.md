# Step 3 — `<cfb-board-orchestrator>` · Pub/Sub

In Step 2 you rendered one **molecule** (`<cfb-session-card>`) from session data. Now the board becomes **live**: a 
control can announce “new session” and **other** components update — **without** importing each other’s classes.

This step is about **events bubbling up** and **state pushed down** through attributes. The exact event name, payload 
shape, and wiring live in **Concepts** and **`events.js`** — after you’ve done **Connections** — so your first guesses 
in the learning log stay honest.

> **Before you start:** branch, HTTP server, clean console — see [getting-started.md](./getting-started.md).

### Async / solo

These challenges are written for **async, often solo** work. Use [your Step 3 learning log](./learning-log.md), a short message to 
your facilitator or team, or a brief sync when the README says “pair.” **Short timeboxes** matter more than the format.

---

## Learning goal

By the end of this step, you can:

- Dispatch a **`CustomEvent`** that **bubbles** so a deep child can signal an ancestor **without imports**.
- Implement an **orchestrator** that listens on itself, keeps **`#sessions`**, and pushes **`data-sessions`** down to `<cfb-schedule>`.
- Explain why **`observedAttributes` + `attributeChangedCallback`** act like simple **parent → child** data binding for the schedule.

---

## 1) Connections

Do these **in order**; capture answers in [your Step 3 learning log](./learning-log.md).

1. **Solo, ~2 min — How does the button reach the board?**  
   [How does the button reach the board?](./learning-log.md#step-3-connections-how-notify) *(Revisit in Conclusions.)*

2. **Solo, ~3 min — Bridge from Step 2**  
   [Bridge from Step 2](./learning-log.md#step-3-bridge-step-2): single card vs dynamic list.

3. **Optional pair / async, ~3 min**  
   [Surprise / compare](./learning-log.md#step-3-connections-surprise).

4. **Solo, ~2 min — Topic link**  
   [Topic link](./learning-log.md#step-3-topic-link): **A** or **B**.

---

## 2) Concepts

### Events up, state down

- **Up:** a component calls **`dispatchEvent`** on itself. With **`bubbles: true`**, the event walks toward `document`;
  **ancestors** can listen (including your orchestrator).
- **Down:** the orchestrator updates **`data-sessions`** on `<cfb-schedule>`. The schedule declares **`observedAttributes`** 
  and **re-renders** when that attribute changes — no direct reference to child card internals. (this is already 
  implemented)

Neither the generator nor the schedule needs to **`import`** the orchestrator’s class. The **DOM tree** is the wiring.

### `sessionDetails` and `cfb-session-created`

This repo uses **`events.js`**:

- Event **type** (code wins): **`cfb-session-created`** (`EventTypes.SESSION_CREATED`).
- **`cfbSessionCreated(data)`** builds a **`CustomEvent`** whose **`detail`** merges **`sessionDetails(data)`** from 
  [`../step-2/lib/builds-session-details.js`](../step-2/lib/builds-session-details.js) with a **`_type`** field so the orchestrator can verify the payload.

The generator calls **`cfbSessionCreated(...)`** with the object from [`lib/generate-random-session.js`](./lib/generate-random-session.js). Shape 
includes **`id`**, **`title`**, **`day`**, **`room`**, **`tags`**, **`attendees`**, etc. — normalized through **`sessionDetails`**.

### End-to-end flow (reference)

Legend: ✨ you implement / finish · 🚧 partly provided · ✅ read & trace

```
[Click “Add random session”]
        │
        ▼
✨ cfb-session-generator
  dispatches cfb-session-created { bubbles: true, composed: true }
  detail: sessionDetails(session) + _type
        │  bubbles UP
        ▼
🚧 cfb-board-orchestrator
  listens for cfb-session-created
  pushes session into #sessions
  sets data-sessions='[…]' on <cfb-schedule class="cfb-updates-schedule">
        │  attribute goes DOWN
        ▼
✅ cfb-schedule
  observedAttributes → data-sessions
  parses JSON → groups by day → renders <cfb-session-card> per session
```

### Orchestrator role

- **One job:** coordinate — merge incoming sessions and **fan out** list state to schedule element(s) via **attributes**.
- **Not** the generator’s job to find the schedule; **not** the schedule’s job to listen for button clicks.

### Listener hygiene

Use a **stable** function reference for **`addEventListener`** / **`removeEventListener`** (e.g. a **bound** method or 
a **class field arrow**). Remove listeners in **`disconnectedCallback`** to avoid leaks.

---

### One-minute review (~1 min)

After reading the sections above, complete [One-minute review](./learning-log.md#step-3-concepts-one-minute) in your learning log.

---

### Concept check

Do **two** short activities in your [learning log](./learning-log.md). 

1. **Mini quiz** — Open [Mini quiz](./learning-log.md#step-3-concept-quiz) and answer the three questions there *before* 
   you rely on copy-paste from the source files.
2. **Flow sketch** — Then open [Flow sketch](./learning-log.md#step-3-concept-flow-sketch) and draw the four-step pipeline
   (boxes + arrow labels). Paper is fine; paste a photo or ASCII into the log if you like.

When both are done, move on to **Concrete practice**.

---

## 3) Concrete practice

### Files to work in

| File                                                       | Role                                                                                                  |
|------------------------------------------------------------|-------------------------------------------------------------------------------------------------------|
| [`cfb-session-generator.js`](./cfb-session-generator.js)   | Button → **`cfbSessionCreated`** with random session data                                             |
| [`cfb-board-orchestrator.js`](./cfb-board-orchestrator.js) | Listen · maintain **`#sessions`** · **`setAttribute('data-sessions', …)`** on `.cfb-updates-schedule` |
| [`cfb-schedule.js`](./cfb-schedule.js)                     | **Read** implementation: **`data-sessions`**, grouping, cards                                         |

Also scan [`events.js`](./events.js) and [`index.js`](./index.js) for registration order (`cfb-tag` / **`cfb-session-card`** before cards render).

Build so you can **show**:

- [ ] **`cfb-session-generator`**: button in **`connectedCallback`**; click builds a session (use **`generateRandomSession`**) 
      and dispatches **`cfbSessionCreated(...)`** from **`events.js`** (not a hand-rolled string event type unless you 
      match **`events.js`**).
- [ ] **`cfb-board-orchestrator`**: register a listener on **self** for **`EventTypes.SESSION_CREATED`** (event string 
      **`cfb-session-created`**); on each event, append to **`#sessions`** and set **`data-sessions`** on 
      **`querySelectorAll('.cfb-updates-schedule')`**.
- [ ] **Remove** the same listener in **`disconnectedCallback`**.
- [ ] **`cfb-schedule`**: trace **`observedAttributes`**, **`attributeChangedCallback`**, **`#render`**, and how it emits
      **`<cfb-session-card data-session-details='…'>`**.

**Constraints**

- HTML, JavaScript, and (optionally) CSS only — no frameworks.
- Aim for about **30–45 minutes** on the core challenge.

**Definition of done**

- Clicking **Add random session** adds a visible card (or updates the list) **without** any component **`import`**ing another’s class for wiring.
- **`data-sessions`** on `<cfb-schedule>` updates and the schedule re-renders.
- You can name the event type **`cfb-session-created`** and point to **`sessionDetails`** / **`events.js`** in one sentence.

In [Question for your facilitator](./learning-log.md#step-3-concrete-facilitator-question), ask one real question and capture the answer.

---

## 4) Conclusions

### 1) Quick check

Answer in [your learning log — Quick check](./learning-log.md#step-3-conclusions-quick-check):

- Where is **`cfb-session-created`** defined, and who **dispatches** it?
- In one line: what travels **up** vs **down** in this step?

### 2) Loop back

Update [How does the button reach the board?](./learning-log.md#step-3-loop-back-notify).

### 3) Key takeaway (journey hub)

Add **one or two sentences** in the [journey hub `learning-log.md`](../learning-log.md#step-3-key-takeaway).

---

### Demos / issues

- Share a short screen recording or a [CodePen](https://codepen.io) link if you want feedback.
- If you get stuck, note it in your learning log or ping your facilitator.

---

## Tips

### Stable listener references

```js
#onSessionCreated = (e) => { /* update #sessions, push data-sessions */ }

connectedCallback() {
  this.addEventListener(EventTypes.SESSION_CREATED, this.#onSessionCreated)
}
disconnectedCallback() {
  this.removeEventListener(EventTypes.SESSION_CREATED, this.#onSessionCreated)
}
```

If you use **`.bind(this)`**, you must **remove** the **same** function reference — otherwise **`removeEventListener`** won’t match.

Curious why? See **Extras** at the end of this README — optional self-study on **`this`** binding.

### Schedule attribute

`cfb-schedule` listens for **`data-sessions`** — a **JSON array** of session objects (each compatible with **`sessionDetails`** / card **`data-session-details`**).

```js
static get observedAttributes() { return ['data-sessions'] }

attributeChangedCallback(name, _old, newValue) {
  if (name === 'data-sessions') {
    this.#sessions = JSON.parse(newValue ?? '[]')
    this.#render()
  }
}
```

---

## Extras

If you finish early:

- [ ] Dispatch **`sessionsCleared`** (or similar); orchestrator resets **`#sessions`** and pushes **`[]`** down.
- [ ] Animate new cards with **`@keyframes`** when a card appears.
- [ ] A small **session count** badge elsewhere: listen for **`cfb-session-created`** without importing the orchestrator.
- [ ] Compare this in-memory list with **Step 4** (IndexedDB): what does persistence buy you?
- [ ] **Self-study (optional, not part of this step’s scope):** Dig into how **`this`** is bound in JavaScript — plain functions vs **arrow functions**, **`.bind(this)`**, and object methods. It explains why **`removeEventListener`** must receive the **same** function reference you passed to **`addEventListener`** ([listener hygiene above](#stable-listener-references)). [MDN: `this`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) is a solid starting point.

---

### End result (skills you can demonstrate)

- **`CustomEvent`** + **`cfb-session-created`** with **`bubbles: true`** / **`composed: true`**
- **Orchestrator / mediator** — coordinate without coupling class names
- **Push state down** via **`data-sessions`** + **`attributeChangedCallback`**
- **Clean teardown** — **`removeEventListener`** in **`disconnectedCallback`**
- **`sessionDetails`** as the shared session shape from **`events.js`**
