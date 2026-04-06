// Step 4 — Load from IndexedDB
//
// Most of Steps 1–3 is reused unchanged.
// Four things are new:
//   1. <cfb-session-loader>     — poplulates IDB with seed data (if IDB is empty)
//   2. <cfb-session-store>      — catches cfb-session-created + cfb-session-removed
//                                 → mutates IDB → fires sessionsLoaded
//   3. <cfb-session-card>       — Implements a 'menu' behavior for the session card
//   4. <cfb-menu>               — fires cfb-session-removed using step-4 events.js

import { CfbTag } from '../step-1/cfb-tag.js' // ✅
import { CfbSessionCard } from './cfb-session-card.js' // ✅ rewritten from step-2
import { CfbSchedule } from './cfb-schedule.js' // 🚧 rewrittern from step-3
import { CfbSessionGenerator } from '../step-3/cfb-session-generator.js' // ✅
import { CfbBoardOrchestrator } from './cfb-board-orchestrator.js' // 🚧 from step-3
import { CfbMenu } from './cfb-menu.js' // ✅
import { CfbSessionLoader } from './cfb-session-loader.js' // ✨
import { CfbSessionStore } from './cfb-session-store.js' // ✨

customElements.define('cfb-tag', CfbTag)
customElements.define(CfbMenu.elementName, CfbMenu)
customElements.define(CfbSessionCard.elementName, CfbSessionCard)
customElements.define('cfb-schedule', CfbSchedule)
customElements.define('cfb-board-orchestrator', CfbBoardOrchestrator)
customElements.define('cfb-session-loader', CfbSessionLoader)
customElements.define('cfb-session-generator', CfbSessionGenerator)
customElements.define('cfb-session-store', CfbSessionStore)
