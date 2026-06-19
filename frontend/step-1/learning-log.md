# Learning log — Step 1

Use this file while you work through [Step 1 README](./README.md). When you finish the step, add your **key takeaway**
in the [journey hub `learning-log.md`](../learning-log.md#step-1-key-takeaway).

---

### Step 1 — Connections: What runs first?

_Solo, ~2 minutes. Before you read the Concepts section in the README._

If I `document.createElement('cfb-tag')`, set `data-label`, then `appendChild` to the body, which callback runs first
— `connectedCallback` or `attributeChangedCallback`? Why do you think so?

>

_(You will revisit this in Conclusions.)_

---

### Step 1 — Connections: Framework lifecycles

_Solo, ~3 minutes._

How do React / Vue / Angular “mount / update” ideas map to `connectedCallback` and `attributeChangedCallback` for custom
elements?

>

---

<a id="step-1-bridge-step-0"></a>

### Step 1 — Connections: Bridge from Step 0

_Solo, ~3 minutes. Open **your**  [`step-0/index.html`](../step-0/index.html). Find **one** tag atom written as
`<span class="cfb-tag …">…</span>`.

**Visible label text on the atom you picked**

>

**Full `class` on that `<span>`**

>

**What becomes `data-label` / `data-color` on `<cfb-tag>`? (one line)**

>

---

<a id="step-1-topic-link"></a>

### Step 1 — Connections: Topic link

_Solo, ~2 minutes. Answer **A** or **B** — not both._

**A) An atom/badge/tag I built before — where, and what it “owned”**

>

**B) Or: which Step 0 takeaway goal does `<cfb-tag>` serve most, and why?**  
_(See [Step 0 — Top takeaways](../step-0/learning-log.md#step-0-top-takeaways).)_

>

---

<a id="step-1-myth-or-fact"></a>

### Step 1 — Concepts: Myth or fact

_Mark **M** or **F** first; then correct any mistakes in one line each._

1. `attributeChangedCallback` runs for every HTML attribute as soon as you set the attribute, even if the name is
   listed in `observedAttributes`.

    - Your first guess (M/F): ___
    - Correction / note: ___

2. If the element is only defined in HTML with fixed `data-*` values and you never change them from within JS,
   `attributeChangedCallback` might never run.

    - Your first guess (M/F): ___
    - Correction / note: ___

3. `connectedCallback` is always guaranteed to run before any `attributeChangedCallback` for that element.

    - Your first guess (M/F): ___
    - Correction / note: ___

---

[← Back to README — 3) Concrete practice](./README.md#3-concrete-practice)

---

<a id="step-1-one-minute-review"></a>

### Step 1 — Concrete Practice: One minute review

_Solo, 3 minutes: What Surprised you in building your first component? What struggles you had?

>

---

[← Back to README — 4) Conclusions](./README.md#4-conclusions)

---

### Step 1 — Conclusions: What this component owns

_One or two sentences._

What does `<cfb-tag>` own? What happens on connect and when attributes change?

>

---

### Step 1 — Conclusions: Quick check

_One or two sentences._

What is one difference between “static span + classes” and “`<cfb-tag>` + attributes”? And why would we use which

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

### Step 1 - Key takeaway (journey hub)

Add **one or two sentences** in the [journey hub `learning-log.md`](../learning-log.md#step-1--basic-web-component)

---
