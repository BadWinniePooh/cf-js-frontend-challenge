# Learning log - Step 5

Use this file while you work through [Step 5 README](./README.md). When you finish the step, add your **key takeaway**
in the [journey hub `learning-log.md`](../learning-log.md#step-5-key-takeaway).

---

<a id="step-5-connections-submit-guess"></a>

### Step 5 - Connections: Submit guess (think → ink)

_Solo, ~2 minutes. **Writing.** Answer **before** you read Concepts - a wrong guess is useful._

You click **+ Add Session**, leave **Title** empty (or under 5 characters), and press **Add session**.

**What do you predict happens next?** (Browser? Your component? Both?) Two or three lines max.

> ___ 

_(You will [loop back](#step-5-loop-back-submit-guess) in Conclusions.)_

---

<a id="step-5-connections-bridge-step4"></a>

### Step 5 - Connections: Bridge from Step 4

_Solo, ~3 minutes._

In Step 4, new sessions reached IndexedDB via **`cfb-session-created`** (generator) → **`<cfb-session-store>`**
→ **`cfb-sessions-loaded-to-idb`** → orchestrator bumps **`data-latest-updated-at`** → **`<cfb-schedule>`** pulls rows.

**If you only replace the generator with a form that dispatches the same `cfb-session-created` shape, what parts of
that chain stay unchanged?** List them as a short bullet list.

> ___

---

<a id="step-5-connections-id-owner"></a>

### Step 5 - Connections: Who owns the `id`?

_Solo, ~1 minute. One sentence._

Who should define the Id of the session? Frontend or Backend? Why?

> ___

---

<a id="step-5-connections-surprise"></a>

### Step 5 - Connections: Surprise or compare

_~3 minutes. **Different** mode - pick one._

**Solo:** One thing about **HTML constraint validation** or **`FormData`** that surprised you in the past
(or that you expect might surprise you this week). One line.

> ___

---

<a id="step-5-connections-where-stand"></a>

### Step 5 - Connections: Where do you stand (topic link)

_Solo, ~2 minutes. Answer **A** or **B** - not both. **Short** - one or two lines._

**A)** In a framework you know, how does form state usually relate to the DOM? One line: *more in JS state*,
*more in the DOM*, or *mixed* - and why you said so.

> ___

**B)** Name **one** situation where you would **still** add custom JS validation on top of native constraints.

> ___

---

[← Back to README - 2) Concepts](./README.md#2-concepts)

---

<a id="step-5-concepts-one-minute"></a>

### Step 5 - Concepts: One-minute review

_After reading README Concepts - ~1 minute. **Shorter** is better than complete._

Two bullets:

1. What is **one** field you read with **`FormData`** vs **one** value you might **not** trust only to `FormData.get`
2. Why could a `fieldset` be useful in a form like 'Add Session' form?

>

---

<a id="step-5-concept-quiz"></a>

### Step 5 - Concept check: Mini quiz + myth or fact

_Answer **from memory first** (~5 minutes). Then peek at [`cfb-add-session-form.js`](./cfb-add-session-form.js) if
needed._

**Quiz**

1. How can you make `FormData` to have the selected radio group button?

   >

2. After a successful submit, why is **`form.reset()`** (or closing the dialog that resets) useful for the **next** add?

   >

**Myth or fact** - write **M** or **F** next to each line.

1. `FormData` can read the selected **`session-type`** radio when each option shares the same **`name`**.

- Your first guess (M/F): ___ 
- Correction / note: ___

2.  Session **`id`** should be a visible required field so power users can control collisions.

- Your first guess (M/F): ___
- Correction / note: ___

---

[← Back to README - 3) Concrete practice](./README.md#3-concrete-practice)

---

<a id="step-5-concepts-sketch"></a>

### Step 5 - Concrete Practice: Sketch the signal path (**Images**)

_Solo, ~3 minutes. **Different** format - no perfect art._

On paper or in this log, draw **boxes and arrows** from: **user submit** → **`<cfb-add-session-form>`** → **event** → *
*store** → **IDB** → **orchestrator** → **schedule**.  
Label **only** the **event name(s)** and **attribute** the schedule watches (peek at the README Concepts if you are
stuck - then note *what you had wrong*).

_(Optional: snap a photo into your notes elsewhere; here, ASCII is enough.)_

---

[← Back to README - 4) Conclusions](./README.md#4-conclusions)

---

<a id="step-5-conclusions-quick-check"></a>

### Step 5 - Conclusions: Quick check

_~5 minutes._

1. Write **three** advantages of **native** constraint validation over a big hand-rolled **`if / else`** ruleset in
   submit handlers.

   > ___

2. **True or false:** “`FormData` can read selected radio values when fields are named.” - **One sentence**
   justification.

   > ___

3. **True or false:** “Session ID should be entered manually by users.” - **One sentence** justification.

   > ___

---

<a id="step-5-loop-back-submit-guess"></a>

### Step 5 - Conclusions: Loop back - submit guess

_Look at your answer under [Submit guess](#step-5-connections-submit-guess). Update in one or two lines: what actually
happened when you tried an invalid submit?_

> ___

Write the **question** you asked (or will ask), then **their answer or your notes**.

**My question**

> ___

**Facilitator reply / notes**

> ___

---

<a id="step-5-facilitator-question"></a>

### Step 5 - Question for your facilitator

_Solo, ~5 minutes. **Different** from the myth/fact item above - this one is open._

Ask **one** question about **forms in web components**, **`FormData`**, **`dialog`**, or **keeping add vs edit flows
separate**. Paste their reply (or your notes) below.

**My question**

>

**Facilitator reply / notes**

>

---

[← Journey hub (key takeaways)](../learning-log.md)