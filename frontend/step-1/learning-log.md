# Learning log — Step 1

Use this file while you work through [Step 1 README](./README.md). When you finish the step, add your **key takeaway** in the [journey hub `learning-log.md`](../learning-log.md#step-1-key-takeaway).

---

### Step 1 — Connections: What runs first?

_Solo, ~2 minutes. Before you read the Concepts section in the README._

If I `document.createElement('cfb-tag')`, set `data-label`, then `appendChild` to the body, which callback runs first — `connectedCallback` or `attributeChangedCallback`? Why do you think so?

> 

_(You will revisit this in Conclusions.)_

---

### Step 1 — Connections: Framework lifecycles

_Solo, ~3 minutes._

How do React / Vue / Angular “mount / update” ideas map to `connectedCallback` and `attributeChangedCallback` for custom elements?

> 

---

### Step 1 — Connections: Surprise (solo) or compare (pair)

_~3 minutes._

If solo: one sentence — *The biggest surprise for me was ___.*

If you discussed with a peer: what one sentence did each of you take away?

> 

---

<a id="step-1-bridge-step-0"></a>

### Step 1 — Connections: Bridge from Step 0

_Solo, ~3 minutes. Use your Step 0 `index.html`, or the repo’s [`../step-0/index.html`](../step-0/index.html) / [`../index.html`](../index.html) if you skipped Step 0._

**Visible label text on the chip you picked**

> 

**Full `class` on that `<span>`**

> 

**What becomes `data-label` / `data-color` on `<cfb-tag>`? (one line)**

> 

---

<a id="step-1-topic-link"></a>

### Step 1 — Connections: Topic link

_Solo, ~2 minutes. Answer **A** or **B** — not both._

**A) A chip/badge/tag I built before — where, and what it “owned”**

> 

**B) Or: which Step 0 takeaway goal does `<cfb-tag>` serve most, and why?**  
_(See [Step 0 — Top takeaways](../step-0/learning-log.md#step-0-top-takeaways).)_

> 

---

<a id="step-1-myth-or-fact"></a>

### Step 1 — Concepts: Myth or fact

_Mark **M** or **F** first; then correct any mistakes in one line each._

1. `attributeChangedCallback` runs for every HTML attribute as soon as you set it, even if the name is not listed in `observedAttributes`.

   - Your first guess (M/F): ___
   - Correction / note: ___

2. If the element is only ever declared in HTML with fixed `data-*` values and you never change them from JS, `attributeChangedCallback` might never run.

   - Your first guess (M/F): ___
   - Correction / note: ___

3. `connectedCallback` is always guaranteed to run before any `attributeChangedCallback` for that element.

   - Your first guess (M/F): ___
   - Correction / note: ___

---

### Step 1 — Conclusions: What this component owns

_One or two sentences._

What does `<cfb-tag>` own? What happens on connect and when attributes change?

> 

---

### Step 1 — Conclusions: Loop back — what runs first?

_Look at your answer under “What runs first?” above. Update in one line if needed._

> 

---

### Step 1 — Conclusions: Commitment

_Complete the sentence._

Next time I build a presentational custom element, I will ___.

> 

---

[← Journey hub (key takeaways)](../learning-log.md)
