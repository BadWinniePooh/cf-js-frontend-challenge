# Test Step T-0 — Setup · Mocha + Web Test Runner

Welcome to the testing track of the CodeFreeze Board challenges!

While the main weekly steps focus on *building* components, this track focuses
on *testing* them. The two tracks are designed to go hand-in-hand — you can
run them in parallel or come back to add tests after each step.

Before you can test anything, you need a test runner. This step is all about
getting one green dot on the screen.

---

## Why not JSDOM / Jest?

You might be used to running component tests with **Jest** + **JSDOM** or a
similar setup. JSDOM is a JavaScript re-implementation of the DOM — it is
fast and portable, but it does **not** support Custom Elements or Shadow DOM.
That means `customElements.define()`, `connectedCallback`, and
`this.attachShadow()` simply do not work there.

`@web/test-runner` solves this by running your tests inside a **real browser
engine**. Your component code runs in the exact same environment as production
— because it literally is.

```
Jest + JSDOM          @web/test-runner
──────────────────    ──────────────────────────────────
fast, no browser      real Chromium / Firefox / WebKit
no Custom Elements    customElements.define() ✓
no Shadow DOM         attachShadow() ✓
no :defined selector  all CSS selectors ✓
```

And, as Aki has a hate-hate relationship with **Jest** (it being super slow),
having a tool that runs mocha and uses sinon and chai, is only a plus.

---

## What to build

- [ ] Initialise an npm project in this folder
- [ ] Install `@web/test-runner`, `@esm-bundle/chai`, and
      `@web/dev-server-import-maps` as dev dependencies
- [x] Add test scripts to `package.json`
- [x] Create `test/web-test-runner.config.mjs` with the import maps plugin
- [x] Write a smoke test in `test/example/smoke.test.js` that fails
- [ ] Run tests `npm run test` and `npm run test:manual`
- [ ] Fix the test, run again

## Constraints

- Max **20 minutes** — this is pure tooling setup, not component work yet.
- No component code in this step.

---

## Tips

### Installing the packages

```bash
npm init -y
npm install --save-dev @web/test-runner chai
npm install --save-dev @web/dev-server-import-maps
```

Notice that `@web/test-runner-playwright` is **not** in the list. Read on to
find out why.

### The `package.json` test scripts

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "test":          "web-test-runner \"test/**/*.test.js\" --node-resolve --config test/web-test-runner.config.mjs",
    "test:watch":    "web-test-runner \"test/**/*.test.js\" --node-resolve --watch",
    "test:manual":   "web-test-runner \"test/**/*.test.js\" --node-resolve --config test/web-test-runner.config.mjs --manual",
    "test:specific": "web-test-runner --files=test/**/*${PATTERN:-*}*.test.js --node-resolve --config test/web-test-runner.config.mjs"
  }
}
```

| Script | What it does |
|--------|-------------|
| `npm test` | Run the full suite once and exit |
| `npm run test:watch` | Re-run on every file save (great during active development) |
| `npm run test:manual` | Open the WTR debug UI in the browser — useful when you want to step through a test with DevTools |
| `npm run test:specific` | Run only files matching a pattern, e.g. `PATTERN=cfb-tag npm run test:specific` |

The `--node-resolve` flag lets the runner resolve bare `import` specifiers
(like `chai`) from `node_modules`, just like a bundler would.

### The config file

Create the config at `test/web-test-runner.config.mjs` — notice it lives
**inside** the `test/` folder, which is why the scripts pass
`--config test/web-test-runner.config.mjs` explicitly.

```js
import { importMapsPlugin } from '@web/dev-server-import-maps'

const testImportMappings = {
  // Add module remaps here, per test folder
}

const plugins = [
  importMapsPlugin({
    inject: {
      importMap: {
        imports: testImportMappings,
      },
    },
  }),
]

export default {
  plugins,
  nodeResolve: true,
  browserStartTimeout: 60000,
  testFramework: {
    config: {
      timeout: 3000,
    },
  },
  files: ['test/**/*.test.js'],
}
```

### Why `importMapsPlugin`?

An **import map** is a browser standard that lets you remap bare module
specifiers — `import './my-module.js'` — to a different URL at load time,
without touching the source file.

In a test context this is extremely useful: you can swap a real dependency for
a fake one just for the test run, without any build step or wrapping code.

```js
// Redirect every import of the real API client to a lightweight stub
const testImportMappings = {
  '/src/api/client.js': '/test/fakes/api-client.fake.js',
}
```

When the browser loads any file that does `import './api/client.js'`, it gets
the fake instead. The component code is completely unaware of the swap. This
is a clean, standards-based alternative to Jest's `jest.mock()`.

### Why no Playwright launcher?

When you leave the `browsers` array out of the config, `@web/test-runner` falls
back to its **built-in Chrome launcher**, which uses the **Chrome DevTools
Protocol (CDP)** to drive whatever Chrome or Chromium is already installed on
your machine.

Playwright is a separate browser automation layer on top of CDP. It is powerful
(multi-browser, cross-platform), but it comes with a cost:

- It downloads its own browser binaries (~170 MB per browser) even if you
  already have Chrome installed
- It adds an extra dependency and a longer `npm install`
- It is simply not needed when you only need Chromium on a developer machine
  where Chrome is already present

The built-in CDP launcher is faster to install, starts up slightly quicker,
and covers everything we need for these challenges. If you later need to run
tests in Firefox or WebKit, you can re-add the Playwright launcher for those
engines specifically.

### Your first test

Create `test/example/smoke.test.js`. Keep it trivially simple — the goal is
only to verify the toolchain works end-to-end. Run it and see it fail:

```js
import { expect } from 'chai'

describe('smoke', () => {
  it('true is true', () => {
    expect(true).to.be.false
  })
})
```

### Running the tests

```bash
npm test                                   # full suite, run once
npm run test:watch                         # re-run on file save
npm run test:manual                        # open debug UI in browser
PATTERN=cfb-tag npm run test:specific      # run only cfb-tag tests
```

You should see output like:

```
Chrome: |██████████████████████████| 1/1 test files | 1 passed, 0 failed
```

---

## Extras

Should you finish early, here are some ideas to go deeper:

- [ ] **Second browser** — add `firefoxLauncher` or `webkitLauncher` from
      `@web/test-runner-playwright` to the `browsers` array and run tests in
      multiple engines at once
- [ ] **Coverage** — add `--coverage` to the test script and open the generated
      `coverage/` report in a browser
- [ ] **Import map swap** — add a fake module to `testImportMappings` and
      verify a test can import the fake instead of the real thing

---

## Demos

If you complete the challenge, share a short screen recording or paste your
terminal output here.

## Issues

If you get stuck, note the problem here so we can discuss it together.

---

### End result

After completing this step you will have learned:

- Why **browser-native test runners** matter for Web Components
- How `@web/test-runner` drives a real Chrome instance via **CDP** without
  Playwright — and when you would bring Playwright back
- How **import maps** let you swap a real module for a test fake without
  touching component code — a clean browser-native alternative to `jest.mock()`
- The role of `chai` — Chai compiled as an ES module so it loads
  directly in the browser without a build step
- Mocha's `describe` / `it` structure running **inside** a browser context
- The four `npm` scripts and when to reach for each one
