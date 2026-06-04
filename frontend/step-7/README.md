# Step 7 — Load from Backend · `fetch` + MSW

In earlier steps the board got data from **generators**, **forms**, and **IndexedDB** seeded in-page. Real products load
**schedule metadata** and **sessions** over **HTTP**, persist them, then render. This step keeps 
**components dumb about mocks**: they call **`fetch`** (here via a thin **[`lib/api/backend-api.js`](./lib/api/backend-api.js)** helper), 
save to **IDB**, and signal completion with **bubbling `CustomEvent`s**. 

We also learn of a mockServiceWorker (MSW) that intercepts **`fetch`** and **responds** with **JSON** data. This is useful 
sometimes for frontend development, but especially useful in testing -> that's another learning goal altogether.

> **Before you start:** branch, HTTP server from **`frontend/`**, MSW or **`step-7-be`** — see [getting-started.md](./getting-started.md).

### Async / solo

Use [your Step 7 learning log](./learning-log.md), a short note to your facilitator, or a sync when the README says “compare.” **Timeboxes** beat polish.

---

## Learning goal

By the end of this step, you can:

- Explain the **loader** pattern: **`fetch` → parse JSON → persist to IndexedDB → dispatch a completion event** 
  (with **`res.ok`** / **`try`/`catch`** hygiene).
- Trace **`<cfb-board-orchestrator>`** waiting for **`scheduleLoaded`** **and** **`sessionsLoaded`** before bumping
  **`data-latest-updated-at`** on **`.listens-schedule-updates`**.
- Extra: Describe how **MSW** intercepts **`fetch`** while **loader** files stay free of **`import 'msw'`**.
- Optional: relate **`sessionsBackendUpdated`** / **`.listens-session-reloads`** in this repo to “refresh sessions only”
  after a successful **PUT**/**PATCH**.

---

## 1) Connections

Do these **in order**; capture answers in [your Step 7 learning log](./learning-log.md).

1. **Solo, ~2 min — Think → ink (first fetch)**  
   [First fetch](./learning-log.md#step-7-connections-first-fetch) *(revisit in [Loop back](./learning-log.md#step-7-loop-back-first-fetch)).*

2. **Solo, ~4 min — Bridge from Step 4–6**  
   [Bridge from Step 4–6](./learning-log.md#step-7-bridge-step-4-6).

3. **Optional pair / async, ~3 min**  
   [Surprise / compare](./learning-log.md#step-7-connections-surprise).

4. **Solo, ~2 min — Topic link**  
   [Topic link](./learning-log.md#step-7-topic-link): answer **A** or **B**.

---

## 2) Concepts

### Fetching datd from the backend.

Earlier, we often used to use libraries like **`axios`** to make HTTP requests. Nowadays the **browser** has a built-in
**`fetch`** function that's **much** easier to use. In this exercise we'll use **`fetch`** to load data from the backend.

To do that, we have an empty **[`backend-api.js`](./lib/api/backend-api.js)** file that we'll implement in this step.

### Backend API and dependency injection.

If this would be a backend code, we'd want to inject the fetch into the components where it's used because that would
be an easy way to pass the fetch to the the component for easy testing. But in frontend code, when we test the component
using web-test-runner, we're running the tests in the real browser, and then we can use the browser's own 'dependency' 
injection mechanism, called ImportMaps. But that's a topic of testing, here I hope you just trust me.

### `fetch` and errors

when fetching data from backend, there are 2 things to await for: first the fetch, then the JSON parsing. 

- Check **`res.ok`** (or **`res.status`**) before **`res.json()`** — otherwise you parse **HTML error pages** as 
  JSON and get confusing exceptions.
- Centralising **`fetch`** in **`backend-api.js`** keeps URLs, **`baseUrl`**, and JSON parsing in **one** place; 
  loaders call **`getBackendApi().getSchedule(eventId)`** / **`getSessions(eventId)`** so they stay small. This is 
  also useful because the backendApi can be initialized with baseUrl etc. only once.

### Loader vs schedule

This is following already established patterns in earlier steps. We split the responsibility of loading data from displaying it.
And because the loaders and schedule are not descendants, we use an orchestrator to coordinate the two.

```html
<cfb-board-orchestrator>
    <div class="loader-status">
        <cfb-schedule-loader data-event-id="codefreeze-2025"> </cfb-schedule-loader>
        <cfb-session-loader class="listens-session-reloads" data-event-id="codefreeze-2025"> </cfb-session-loader>
    </div>
    <!--[...omitted for brevity]-->
    <cfb-updates-sessions class="listens-event-changes" data-event-id="codefreeze-2025"> <!-- cfb-session-store earlier -->
        <cfb-add-session-form></cfb-add-session-form>
        <cfb-schedule class="listens-schedule-updates" data-event-id="codefreeze-2025">
        </cfb-schedule>
    </cfb-updates-sessions>
</cfb-board-orchestrator>

```

| Piece                                                    | Responsibility                                                         |
|----------------------------------------------------------|------------------------------------------------------------------------|
| ✨ [`<cfb-schedule-loader>`](./cfb-schedule-loader.js)    | make an HTTP call, write to IDB, dispatch event on success             |
| ✨ [`<cfb-session-loader>`](./cfb-session-loader.js)      | make an HTTP call, write to IDB, dispatch event on success             |
| ✅ [`<cfb-schedule>`](../step-4/cfb-schedule.js) (Step-4) | same as before - isn't it beautiful that these changes have no effect? |

### Events up, attribute down (again)

- Loaders dispatch **`scheduleLoaded`** and **`sessionsLoaded`** with **`bubbles: true`** (and **`composed: true`**) so
  **`<cfb-board-orchestrator>`** can listen on **self** and **not** import loader classes. The change is that it's not listening
  to 'SESSION_LOADED_TO_IDB', but a new event type.
- When **both** have fired for the **same** **`eventId`**, the orchestrator sets **`data-latest-updated-at`** on elements
  matching **`.listens-schedule-updates`** — a **pull** trigger for the schedule.
- Use **stable** listener references and **`removeEventListener`** in **`disconnectedCallback`** on the orchestrator.

### MSW at the boundary

- **`mocks/handlers.js`** defines **`http.get(`${root}/api/schedule/:eventId`, …)`** and sessions route — same paths
  **`backend-api`** calls.
- **`mocks/browser.js`** starts the worker; **`index.js`** should call **`await worker.start(…)`** **before** defining
  elements that **`fetch`** on connect (see commented block in [`index.js`](./index.js)).
- **Components** never **`import`** from **`msw`** — only the app entry does. That is the decoupling PLAN calls out.

### End-to-end flow (reference)

Legend:
- ✅ This is already provided
- 🚧 Partly done, part of this exercise
- ✨ New features, core of the exercise

```
User / UI sets data-event-id on both loaders
        │
        ▼ parallel
✨ cfb-schedule-loader          ✨ cfb-session-loader
   getBackendApi().getSchedule     getBackendApi().getSessions
   → schedule-store (IDB)          → session-store (IDB)
   → dispatch scheduleLoaded        → dispatch sessionsLoaded
        │                                   │
        └──────────── bubbles ──────────────┘
                          ▼
🚧 cfb-board-orchestrator
   when both received for same eventId
   → set data-latest-updated-at on .listens-schedule-updates
                          ▼
✅ cfb-schedule
   attributeChangedCallback → read IDB → render <cfb-session-card>…
```

### Extension in this checkout

[`cfb-board-orchestrator.js`](./cfb-board-orchestrator.js) also listens for **`sessionsBackendUpdated`** and bumps **`.listens-session-reloads`**
with **`data-reload-token`** so only **sessions** refetch after an API update — **schedule** is treated as already fresh.
Trace this **after** you understand the initial dual-loader path.

---

### One-minute review (~1 min)

Complete [One-minute review](./learning-log.md#step-7-concepts-one-minute) in your learning log.

---

### Concept check 

Do **two** short activities in your [learning log](./learning-log.md).

1. **Mini quiz** — [Mini quiz](./learning-log.md#step-7-concept-quiz): answer from memory first.
2. **Flow sketch** — [Flow sketch](./learning-log.md#step-7-concept-flow-sketch): boxes + arrow labels.

When both are done, move on to **Concrete practice**.

---

## 3) Concrete practice

### Files to read (and trace or implement)

| File                                                                                                                          | Role                                                                                                |
|-------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------|
| [`cfb-schedule-loader.js`](./cfb-schedule-loader.js)                                                                          | Schedule **`fetch`** path, IDB write, **`scheduleLoaded`** / **`loaderError`**                      |
| [`cfb-session-loader.js`](./cfb-session-loader.js)                                                                            | Sessions **`fetch`** path, **`data-reload-token`**, **`sessionsLoaded`**                            |
| [`cfb-board-orchestrator.js`](./cfb-board-orchestrator.js)                                                                    | Waits for loader events; sets **`data-latest-updated-at`**; extension: **`sessionsBackendUpdated`** |
| [`../step-4/cfb-schedule.js`](../step-4/cfb-schedule.js)                                                                      | **`data-latest-updated-at`** → pull sessions from IDB → render                                      |
| [`lib/api/backend-api.js`](./lib/api/backend-api.js)                                                                          | **`fetch`** + **`res.ok`** + JSON                                                                   |
| [`lib/store/session-store.js`](./lib/store/session-store.js) / [`lib/store/schedule-store.js`](./lib/store/schedule-store.js) | Persistence helpers loaders call                                                                    |
| [`mocks/handlers.js`](./mocks/handlers.js)                                                                                    | MSW **`http.get`** handlers keyed by **`eventId`**                                                  |
| [`index.js`](./index.js)                                                                                                      | **`configureBackendApi`**, optional **`worker.start()`**, element registration                      |
| [`index.html`](./index.html)                                                                                                  | Loader markup, **`.listens-schedule-updates`**, event switcher buttons                              |

This folder ships as a **reference implementation** — your job is to **understand and demo** the pipeline, then adapt or rebuild in your own branch if your facilitator assigns implementation from scratch.

**Build / trace until you can show:**

- [ ] Swapping **`data-event-id`** (buttons in [`index.html`](./index.html)) triggers **two** parallel loads and ends with an updated board for that event.
- [ ] You can name the **two** success event types the orchestrator waits for and the **attribute** it sets on the schedule.
- [ ] You can point to **where** **`fetch`** is called and **where** MSW is started (two different files).
- [ ] With **`res.ok === false`**, the loader surfaces an **error** state and dispatches **`loaderError`** (trace in [`cfb-session-loader.js`](./cfb-session-loader.js)).

**Constraints**

- HTML, JavaScript, and CSS only — **no** frameworks inside the custom elements.
- **MSW** is the only **mock** dependency for the browser path; **`step-7-be`** is optional real HTTP.
- Target about **45 minutes** for core tracing + log activities.

**Definition of done**

- You can draw the flow from **`fetch`** to **cards** without peeking.
- You complete [Question for your facilitator](./learning-log.md#step-7-concrete-facilitator-question) with one genuine question.

---

## 4) Conclusions

### 1) Quick check

Answer in [your learning log — Quick check](./learning-log.md#step-7-conclusions-quick-check).

### 2) Loop back

Update [First fetch](./learning-log.md#step-7-loop-back-first-fetch).

### 3) PLAN prompts

- [MSW outside components](./learning-log.md#step-7-conclusions-msw-benefit)  
- [True / False — coordination](./learning-log.md#step-7-conclusions-tf-coordination)  
- [True / False — mocks removed](./learning-log.md#step-7-conclusions-tf-mocks-removed)

### 4) Key takeaway (journey hub)

Add **one or two sentences** in the [journey hub `learning-log.md`](../learning-log.md#step-7-key-takeaway).

---

### Demos / issues

- Share a short screen recording (event switcher + Network panel) if you want feedback.
- If you get stuck, note it in your learning log or ping your facilitator.

---

## Tips

### Stable orchestrator listeners

```js
#onLoaderDone = (e) => { /* … */ }

connectedCallback() {
  this.addEventListener('scheduleLoaded', this.#onLoaderDone)
  this.addEventListener('sessionsLoaded', this.#onLoaderDone)
}

disconnectedCallback() {
  this.removeEventListener('scheduleLoaded', this.#onLoaderDone)
  this.removeEventListener('sessionsLoaded', this.#onLoaderDone)
}
```

### Dispatch pattern (loaders)

```js
this.dispatchEvent(new CustomEvent('sessionsLoaded', {
  bubbles: true,
  composed: true,
  detail: { eventId, updatedAt: Date.now() },
}))
```

### HTML shell (core trio)

```html
<cfb-board-orchestrator>
  <cfb-schedule-loader data-event-id="codefreeze-2025"></cfb-schedule-loader>
  <cfb-session-loader data-event-id="codefreeze-2025"></cfb-session-loader>
  <cfb-schedule
    data-event-id="codefreeze-2025"
    class="listens-schedule-updates">
  </cfb-schedule>
</cfb-board-orchestrator>
```

This repo adds **header**, **updates** wrapper, and **loader status** UI around that idea — see [`index.html`](./index.html).

---

## Extras

If you finish early:

- [ ] Add **`<cfb-loader-status>`** driven only by **`scheduleLoaded`** / **`sessionsLoaded`** / **`loaderError`** — no direct imports of loader classes.
- [ ] **`http.get`** **`passthrough`** for one **`eventId`** so it hits a real server; keep others mocked.
- [ ] Return **500** from one handler; prove **`loaderError`** surfaces in the UI.
- [ ] Cache **`updatedAt`** in IDB and **skip** **`fetch`** when data is fresher than **60** seconds.
-
  We also learn of a mockServiceWorker (MSW) that intercepts **`fetch`** and **responds** with **JSON** data. This is useful
  sometimes for frontend development, but especially useful in testing -> that's another learning goal altogether.


---

### End result (skills you can demonstrate)

- **`fetch`**, **`res.ok`**, and **`try`/`catch`** around network + JSON
- **Loader** vs **display** component split
- **`CustomEvent`** bubbling as a **completion** signal
- **Orchestrator** coordinating **multiple async** sources without cross-imports
- **`attributeChangedCallback`** as a **pull** trigger from IDB
- **MSW** (or a real server) at the **edge**, not inside feature components
