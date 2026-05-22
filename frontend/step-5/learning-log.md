
# Learning log — Step 5

Use this file while you work through [Step 5 README](./README.md). When you finish the step, add your **key takeaway** in the [journey hub `learning-log.md`](../learning-log.md#step-5-key-takeaway).

This step leans on **Training from the Back of the Room** ideas adapted for **solo / async**: **different** kinds of prompts (not only prose), **writing** and **drawing**, and **shorter** timeboxes. You will not do every “6 trumps” activity in one sitting — pick what fits your energy; the README lists the **minimum** order.

---

<a id="step-5-connections-submit-guess"></a>

### Step 5 — Connections: Submit guess (think → ink)

_Solo, ~2 minutes. **Writing.** Answer **before** you read Concepts — a wrong guess is useful._

You click **+ Add Session**, leave **Title** empty (or under 5 characters), and press **Add session**.

**What do you predict happens next?** (Browser? Your component? Both?) Two or three lines max.

> 

_(You will [loop back](#step-5-loop-back-submit-guess) in Conclusions.)_

---

<a id="step-5-connections-bridge-step4"></a>

### Step 5 — Connections: Bridge from Step 4

_Solo, ~3 minutes._

In Step 4, new sessions reached IndexedDB via **`cfb-session-created`** (generator) → **`<cfb-session-store>`** 
→ **`cfb-sessions-loaded-to-idb`** → orchestrator bumps **`data-latest-updated-at`** → **`<cfb-schedule>`** pulls rows.

**If you only replace the generator with a form that dispatches the same `cfb-session-created` shape, what parts of 
that chain stay unchanged?** List them as a short bullet list.

> 

---

<a id="step-5-connections-id-owner"></a>

### Step 5 — Connections: Who owns the `id`?

_Solo, ~1 minute. One sentence._

Who should define the Id of the session? Frontend or Backend? Why?

> 

---

<a id="step-5-connections-surprise"></a>

### Step 5 — Connections: Surprise or compare

_~3 minutes. **Different** mode — pick one._

**Solo:** One thing about **HTML constraint validation** or **`FormData`** that surprised you in the past 
(or that you expect might surprise you this week). One line.

**If you later compare with a peer:** What will each of you watch first in DevTools on submit —**Console**, **Network**, or **Elements**?

> 

---

<a id="step-5-connections-where-stand"></a>

### Step 5 — Connections: Where do you stand (topic link)

_Solo, ~2 minutes. Answer **A** or **B** — not both. **Short** — one or two lines._

**A)** In a framework you know, how does form state usually relate to the DOM? One line: *more in JS state*, 
*more in the DOM*, or *mixed* — and why you said so.

> 

**B)** Name **one** situation where you would **still** add custom JS validation on top of native constraints.

> 

---

<a id="step-5-concepts-sketch"></a>

### Step 5 — Concepts: Sketch the signal path (**Images**)

_Solo, ~3 minutes. **Different** format — no perfect art._

On paper or in this log, draw **boxes and arrows** from: **user submit** → **`<cfb-add-session-form>`** → **event** → **store** → **IDB** → **orchestrator** → **schedule**.  
Label **only** the **event name(s)** and **attribute** the schedule watches (peek at the README Concepts if you are stuck — then note *what you had wrong*).

_(Optional: snap a photo into your notes elsewhere; here, ASCII is enough.)_

> 

---

<a id="step-5-concepts-one-minute"></a>

### Step 5 — Concepts: One-minute review

_After reading README Concepts — ~1 minute. **Shorter** is better than complete._

Two bullets:

1. What does **`form.checkValidity()`** do *for you* vs what **`required`** does *for the browser*?
2. What is **one** field you read with **`FormData`** vs **one** value you might **not** trust only to `FormData.get` 
   (hint: tags / chips in this repo)?

> 

---

<a id="step-5-concept-quiz"></a>

### Step 5 — Concept check: Mini quiz + myth or fact

_Answer **from memory first** (~5 minutes). Then peek at [`cfb-add-session-form.js`](./cfb-add-session-form.js) if needed._

**Quiz**

1. Which **`name=`** on the form collects the **selected radio** value in **`FormData`**?

   > 

2. After a successful submit, why is **`form.reset()`** (or closing the dialog that resets) useful for the **next** add?

   > 

**Myth or fact** — write **M** or **F** next to each line.

|    | Statement                                                                                              |
|----|--------------------------------------------------------------------------------------------------------|
| __ | `FormData` can read the selected **`session-type`** radio when each option shares the same **`name`**. |
| __ | Session **`id`** should be a visible required field so power users can control collisions.             |
| __ | **`reportValidity()`** is mainly for showing the browser’s native error UI when constraints fail.      |

> 

---

<a id="step-5-conclusions-quick-check"></a>

### Step 5 — Conclusions: Quick check

_~5 minutes._

1. Write **three** advantages of **native** constraint validation over a big hand-rolled **`if / else`** ruleset in submit handlers.

   > 

2. **True or false:** “`FormData` can read selected radio values when fields are named.” — **One sentence** justification.

   > 

3. **True or false:** “Session ID should be entered manually by users.” — **One sentence** justification.

   > 

---

<a id="step-5-loop-back-submit-guess"></a>

### Step 5 — Conclusions: Loop back — submit guess

_Look at your answer under [Submit guess](#step-5-connections-submit-guess). Update in one or two lines: what actually 
happened when you tried an invalid submit?_

> 

---

<a id="step-5-myth-fact-facilitator"></a>

### Step 5 — Conclusions: Myth & fact → facilitator

_From the **Activity catalogue** in [`../PLAN.md`](../PLAN.md) (“Myth&Fact revisited…”): bring **one** myth-or-fact style question to your facilitator._

Write the **question** you asked (or will ask), then **their answer or your notes**.

**My question**

> 

**Facilitator reply / notes**

> 

---

<a id="step-5-facilitator-question"></a>

### Step 5 — Question for your facilitator

_Solo, ~5 minutes. **Different** from the myth/fact item above — this one is open._

Ask **one** question about **forms in web components**, **`FormData`**, **`dialog`**, or **keeping add vs edit flows separate**. Paste their reply (or your notes) below.

**My question**

> 

**Facilitator reply / notes**

> 

---

[← Journey hub (key takeaways)](../learning-log.md)