# Learning log — Step 6

Use this file while you work through [Step 6 README](./README.md). When you finish the step, add your **key takeaway** in the [journey hub `learning-log.md`](../learning-log.md#step-6-key-takeaway).

This step uses **Training from the Back of the Room** ideas adapted for **solo / async**: **different** prompt types, **writing** and a small **sketch**, and **short** timeboxes. Follow the **order** in the README so your first guesses stay honest.

---

<a id="step-6-connections-formdata-guess"></a>

### Step 6 — Connections: FormData guess (think → ink)

_Solo, ~2 minutes. Answer **before** you read Concepts._

Step 5 collected **`session-type`** with **radio inputs** sharing **`name="session-type"`**.

You replace that block with **`<cfb-session-type name="session-type" required></cfb-session-type>`** — a custom element
with **no** hidden `<input type="radio">`.

**Before you read the APIs:** how do you *think* the browser could still put **`session-type`** into **`new FormData(form)`** 
on submit? One or two sentences (a wrong guess is fine).

> 

_(You will [loop back](#step-6-loop-back-formdata-guess) in Conclusions.)_

---

<a id="step-6-bridge-step-5"></a>

### Step 6 — Connections: Bridge from Step 5

_Solo, ~3 minutes._

List **three** things that should **stay the same** in **`cfb-add-session-form.js`** / **`cfb-edit-session-form.js`** 
after you swap radios for **`<cfb-session-type>`** — think: submit handler, events, `id` generation, store pipeline.

> 

---

<a id="step-6-connections-surprise"></a>

### Step 6 — Connections: Surprise (solo) or compare (pair)

_~3 minutes._

**Solo:** One thing about **form-associated custom elements** or **`ElementInternals`** you expect will trip you up — one line.

**If you compare later:** what will you verify first after submit — **Application → IndexedDB**, **Console**, or 
**Elements** on the form?

> 

---

<a id="step-6-topic-link"></a>

### Step 6 — Connections: Topic link

_Solo, ~2 minutes. Answer **A** or **B** — not both._

**A)** Name one **native** control that already participates in **`FormData`** without you writing a submit “collector” 
for it. One line: why is that similar to what **`setFormValue`** is trying to do?

> 

**B)** In one sentence: when would you **still** prefer radios over a custom tile UI?

> 

---

<a id="step-6-concepts-one-minute"></a>

### Step 6 — Concepts: One-minute review

_After reading the README Concepts sections — ~1 minute._

**Two bullets:**

1. What does **`internals.setFormValue(null)`** communicate vs a non-empty string?
2. Who should call **`reportValidity()`** for a bad **`required`** state — only the custom element, only 
   the `<form>`, or both can be involved?

> 

---

<a id="step-6-concept-quiz"></a>

### Step 6 — Concept check: Mini quiz

_Answer **from memory first** (~4 minutes). Then peek at the README or [`cfb-session-type.js`](./cfb-session-type.js) if needed._

1. Which **static** class field marks a custom element as **form-associated**?

   > 

2. Which method on **`ElementInternals`** writes the control’s value so **`FormData`** can see it under the **`name`** attribute?

   > 

3. Which **`ElementInternals`** method lets you mirror native **`required`** / **`valueMissing`** behaviour with a custom message?

   > 

---

<a id="step-6-concept-flow-sketch"></a>

### Step 6 — Concept check: Flow sketch (visual)

_Solo, ~3 minutes. Training from the Back of the Room — “images / different activity.”_

Draw **six boxes** in a row: **user picks a tile** → **`<cfb-session-type>`** → **parent `<form>`** → **`FormData` / session object** → **`cfb-session-created`** (or **`cfb-session-updated`**) → **store / IDB**.

Add **one short label** on each **arrow** (e.g. **`setFormValue`**, **`checkValidity`**, event name).

> 

---

<a id="step-6-conclusions-quick-check"></a>

### Step 6 — Conclusions: Quick check

_~4 minutes. Short phrases are enough._

1. Where is **`formAssociated`** declared, and where is **`attachInternals()`** called?

   > 

2. In one line: how does **`required`** on **`<cfb-session-type>`** surface a native validation message on submit?

   > 

---

<a id="step-6-loop-back-formdata-guess"></a>

### Step 6 — Conclusions: Loop back — FormData guess

_Look at your answer under [FormData guess](#step-6-connections-formdata-guess). Update in one or two lines: what actually happens in the browser?_

> 

---

<a id="step-6-forms-two-steps"></a>

### Step 6 — Conclusions: Forms across Step 5 + Step 6

_From [`../PLAN.md`](../PLAN.md) — land what “forms” meant two weeks in a row._

In **three** bullets: what did you learn about **forms** in Step 5 vs Step 6? (native constraints vs custom control, 
**`FormData`**, ownership of validation, anything you will reuse.)

> 

---

<a id="step-6-concrete-facilitator-question"></a>

### Step 6 — Conclusions: Question for your facilitator

_Solo, ~5 minutes._

Ask your facilitator **one** question about **`ElementInternals`**, **form-associated custom elements**, **accessibility for tile pickers**, or **how this pattern compares to framework-controlled form state**. Paste their reply (or your notes) below.

**My question**

>

**Facilitator reply / notes**

>

---


[← Journey hub (key takeaways)](../learning-log.md)
