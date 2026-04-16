---
name: codepen-bundle
description: Bundle all JS files for a frontend step into a single codepen.js for CodePen
argument-hint: Step number (e.g. 6)
---

# CodePen Bundle — `./frontend/step-{argument}`

Bundle all JavaScript modules for the given step into a single self-contained
`codepen.js` that can be pasted directly into CodePen's JS panel.

**Argument:** The step number (e.g. `6` → work in `./frontend/step-6/`).

---

## Step 1 — Discover the dependency graph

Start from `./frontend/step-{argument}/index.js` as the entry point.

For every `.js` file you encounter:
1. Read the file.
2. Find all `import` statements (static `import … from '…'` lines).
3. Resolve each import path relative to the current file's location:
   - Paths starting with `./` or `../` are relative — resolve them.
   - Paths containing `../step-X/` point to another step folder — follow them.
   - Ignore any path that is not a local file (e.g. bare module specifiers like `'lit'`).
4. Add the resolved file to the dependency set if not already visited.
5. Recurse into newly discovered files.

Repeat until no new files are found. The result is a complete set of source files.

---

## Step 2 — Topological sort (leaves first)

Order the files so that every file appears **after** all files it imports.
`index.js` must be last. This ensures declarations are defined before use.

---

## Step 3 — Inline all modules into one file

Process each file in sorted order and produce a single output string.

### 3a — Strip import statements
Remove every `import … from '…'` line entirely.
The symbols are already available because the referenced module will appear
earlier in the output.

### 3b — Strip export keywords (keep the declaration)
Apply these transformations:
- `export default class Foo` → `class Foo`
- `export default function foo` → `function foo`
- `export default <expression>` → keep as a `const` assignment or bare expression
- `export class Foo` → `class Foo`
- `export function foo` → `function foo`
- `export const foo` / `export let foo` / `export var foo` → `const foo` / `let foo` / `var foo`
- `export { foo, bar }` → remove the line entirely (names are already in scope)
- `export { foo } from '…'` → remove the line entirely

### 3c — Avoid duplicate variable names
If two modules export a symbol with the same name, keep only the first
definition encountered in dependency order, and drop subsequent duplicates.
Add a short comment like `// [codepen-bundle] duplicate skipped: Foo` where a
definition was dropped.

### 3d — Separate each module with a comment banner
```js
// ── step-X/filename.js ──────────────────────────────────────────────────────
```

---

## Step 4 — Write the output file

Write the complete bundled content to:
```
./frontend/step-{argument}/codepen.js
```

Add a header comment at the very top:
```js
// codepen.js — auto-bundled from step-{argument}
// Entry point: ./frontend/step-{argument}/index.js
// Do not edit manually; regenerate with the codepen-bundle skill.
```

---

## Step 5 — Verify

After writing the file:
1. Confirm the file was created and report its line count.
2. List the modules that were inlined, in bundle order.
3. Call out any imports that were **skipped** (non-local / bare specifiers) so
   the user knows what might need to be loaded separately (e.g. from a CDN).

---

## Constraints

- Do not use any bundler tools (no webpack, esbuild, rollup). Read, transform,
  and concatenate files using only file-reading and file-writing tools.
- Preserve all class definitions, custom element registrations
  (`customElements.define(…)`), and top-level side effects from `index.js`.
- Do not modify any source file — only write `codepen.js`.
- If a file cannot be found, report it clearly and skip it rather than failing.
