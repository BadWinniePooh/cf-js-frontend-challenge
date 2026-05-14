# Learning log — Step 2

Use this file while you work through [Step 2 README](./README.md). When you finish the step, add your **key takeaway** in the [journey hub `learning-log.md`](../learning-log.md#step-2-key-takeaway).

---

<a id="step-2-connections-where-data-lives"></a>

### Step 2 — Connections: Where does session data live?

_Solo, ~2 minutes. Answer **before** you read the Concepts section._

For `<cfb-session-card>`, where does the session payload “live” while you are building this step?

Pick one gut answer — attributes only / JavaScript fields on the class / both — and one short reason.

> 

_(You will revisit this in Conclusions.)_

---

<a id="step-2-bridge-step-1"></a>

### Step 2 — Connections: Bridge from Step 1

_Solo, ~3 minutes._

Open [your Step 1](../step-1/index.html) board or [`../step-1/index.html`](../step-1/index.html). Look at one `<cfb-tag>`.

**How does what you put on `<cfb-tag>` (attributes) map to one row of the session card (tags section)?**

> 

---

<a id="step-2-connections-surprise"></a>

### Step 2 — Connections: Surprise (solo) or compare (pair)

_~3 minutes._

If solo: one sentence — *The hardest part of composing components for me will be ___.*

If you discussed with a peer: what one sentence did each of you take away?

> 

---

<a id="step-2-topic-link"></a>

### Step 2 — Connections: Topic link

_Solo, ~2 minutes. Answer **A** or **B** — not both._

**A)** Name a composite UI you built before (card, list row, form section). What did the parent own vs the children?

> 

**B)** Skim [your Step 1 learning log](../step-1/learning-log.md). In one sentence: how does “what `<cfb-tag>` owns” extend to what `<cfb-session-card>` should own?

> 

---

<a id="step-2-concepts-one-minute"></a>

### Step 2 — Concepts: One-minute review

_After reading the README Concepts section — ~1 minute._

In three bullets or less: what is **one** thing a molecule may do that an atom should not?

> 

---

<a id="step-2-myth-or-fact"></a>

### Step 2 — Concepts: Myth or fact (composition + data)

_Mark **M** (myth) or **F** (fact) first; then correct mistakes in one line each._

1. Composing `<cfb-tag>` inside `<cfb-session-card>` means the card script must imperatively create each tag with 
  `document.createElement`.

   - Your first guess (M/F): ___
   - Correction / note: ___

2. Passing session data as JSON on a single **`data-session-details`** attribute is a valid pattern for structured props
  (keeping payload size reasonable).

   - Your first guess (M/F): ___
   - Correction / note: ___

3. Attendee rows should use a **rich shape** — e.g. `{ "name": string, "initials": string }` — so the footer can show 
   initials and expose full names to assistive labels.

   - Your first guess (M/F): ___
   - Correction / note: ___

4. In Step 2, this molecule should call `fetch()` to load the conference schedule from an API.

   - Your first guess (M/F): ___
   - Correction / note: ___

5. Composing smaller custom elements into a larger one generally **reduces duplicated markup** across the board compared
   to pasting the same HTML in every column.

   - Your first guess (M/F): ___
   - Correction / note: ___

---

<a id="step-2-true-false-composition"></a>

### Step 2 — Conclusions: True / False

_Complete in one line._

**True or false:** “Composing components reduces duplicated markup.”

- Your answer (T/F): ___
- Why (one sentence): ___

---

<a id="step-2-loop-back-data"></a>

### Step 2 — Conclusions: Loop back — where data lives

_Look at your answer under “Where does session data live?” above. Update in one line if needed._

> 

---

<a id="step-2-commitment"></a>

### Step 2 — Conclusions: Commitment

_Complete the sentence._

Next time I build a molecule web component, I will ___.

> 

---

<a id="step-2-concrete-facilitator-myth-fact"></a>

### Step 2 — Concrete practice: your myth or fact for the facilitator

_Solo, ~5 minutes._

1. Write **one** myth-or-fact style statement about **composition**, **JSON `data-*` attributes**, or **parent→child data flow** — something you are genuinely unsure about.

2. Ask your facilitator (PR, chat, sync): *“Myth or fact: …?”*

**My myth/fact question**

> 

**Facilitator reply** _(or your notes after you asked)_

> 

---

[← Journey hub (key takeaways)](../learning-log.md)
