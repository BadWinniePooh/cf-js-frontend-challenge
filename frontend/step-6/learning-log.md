# Learning log - Step 6

Use this file while you work through [Step 6 README](./README.md). When you finish the step, add your **key takeaway**
in the [journey hub `learning-log.md`](../learning-log.md#step-6-key-takeaway).

---

<a id="step-6-connections-formdata-guess"></a>

### Step 6 - Connections: FormData guess (think → ink)

_Solo, ~2 minutes. Answer **before** you read Concepts._

In step-5, the CfbAddSessionForm added all the options for the _Session Type_ with pure radio groups.

Now you'll learn how to replace that group with a custom element `cfb-session-type` - which is a component that does not
have any `input` hiding the logic, but custom HTML.

**Before you read the APIs:** how do you *think* the browser could still put **`session-type`** into
**`new FormData(form)`** on submit? One or two sentences (a wrong guess is fine).

> ___

_(You will [loop back](#step-6-loop-back-formdata-guess) in Conclusions.)_

---

<a id="step-6-bridge-step-5"></a>

### Step 6 - Connections: Bridge from Step 5

_Solo, ~3 minutes._

List **three** things that should **stay the same** in **`cfb-add-session-form.js`** / **`cfb-edit-session-form.js`**
after you swap radio buttons for **`<cfb-session-type>`** - think the whole flow from clicking 'submit' to dispatching
events.

> ___

---

<a id="step-6-connections-surprise"></a>

### Step 6 - Connections: Surprise (solo or pair)

_~3 minutes._

**Solo:** One thing about **form-associated custom elements** or **`ElementInternals`** you expect will trip you up -
one line.

> ___

---

<a id="step-6-topic-link"></a>

### Step 6 - Connections: Topic link

_Solo, ~2 minutes. Answer **A** or **B** - not both._

**A)** Name one **native** control that already participates in **`FormData`** without you writing a submit “collector”
for it.

> ___

**B)** In one sentence: Without knowledge of custom form elements, when would you **still** prefer radios over a custom
tile UI?

> ___

---

[← Back to README - 2) Concepts](./README.md#2-concepts)

---

<a id="step-6-concepts-one-minute"></a>

### Step 6 - Concepts: One-minute review

_After reading the README Concepts sections - ~1 minute._

**Two bullets:**

1. What does **`internals.setFormValue(null)`** communicate vs a non-empty string?
2. Who should call **`reportValidity()`** for a bad **`required`** state - only the custom element, only
   the `<form>`, or both can be involved?

> ___

---

<a id="step-6-concept-quiz"></a>

### Step 6 - Concept check: Mini quiz

_Answer **from memory first** (~4 minutes). Then peek at the README or [`cfb-session-type.js`](./cfb-session-type.js) if
needed._

1. Which **static** class field marks a custom element as **form-associated**?

   > ___

2. Which method on **`ElementInternals`** writes the control’s value so **`FormData`** can see it under the **`name`**
   attribute?

   > ___

3. Which **`ElementInternals`** method lets you mirror native **`required`** / **`valueMissing`** behaviour with a
   custom message?

   > ___

---

[← Back to README - 3) Concrete practice](./README.md#3-concrete-practice)

---

<a id="step-5-myth-fact-facilitator"></a>

### Step 5 - Concrete Practice: Think it and Ink it

1. Think of one minute what you learned on this session?. Then write that down

   > ___ 

---

<a id="step-5-myth-fact-facilitator"></a>

### Step 5 - Concrete Practice: Ask a question from facilitator:

1. Write **one** short statement that could be read as **myth** or **fact** - **`ElementInternals`**, **form-associated
   custom elements**, **accessibility for tile pickers**, or **how this pattern compares to framework-controlled form
   state**.

2. **Ask your facilitator** that question explicitly - e.g. in a PR comment, chat message, or during a sync: *“Myth or
   fact: …?”*

**My myth/fact question**

>

**Facilitator reply** _(or your own notes after you asked)_

>
 
---

[← Back to README - 4) Conclusions](./README.md#4-conclusions)

---

<a id="step-6-conclusions-quick-check"></a>

### Step 6 - Conclusions: Quick check

_~4 minutes. Short phrases are enough._

1. Where is **`formAssociated`** declared, and where is **`attachInternals()`** called?

   > ___

2. In one line: how does **`required`** on **`<cfb-session-type>`** surface a native validation message on submit?

   > ___

---

<a id="step-6-loop-back-formdata-guess"></a>

### Step 6 - Conclusions: Loop back - FormData guess

_Look at your answer under [FormData guess](#step-6-connections-formdata-guess). Update in one or two lines: what
actually happens in the browser?_

> ___

---

<a id="step-6-forms-two-steps"></a>

### Step 6 - Conclusions: Forms across Step 5 + Step 6

In **three** bullets: what did you learn about **forms** in Step 5 vs Step 6? (native constraints vs custom control,
**`FormData`**, ownership of validation, anything you will reuse.)

> ___

---

[← Journey hub (key takeaways)](../learning-log.md)
