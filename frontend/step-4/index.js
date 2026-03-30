// Step 4 — Load from IndexedDB
//
// Most of Steps 1–3 is reused unchanged.
// Four things are new:
//   1. seedIfEmpty()            — seeds IDB on first visit (called here, not in a component)
//   2. <cfb-session-loader>     — reads IDB → fires sessionsLoaded
//   3. <cfb-session-store>      — catches cfb-session-created + cfb-session-removed
//                                 → mutates IDB → fires sessionsLoaded
//   4. <cfb-session-generator>  — fires cfb-session-created using step-4 events.js
//   5. <cfb-session-card>       — fires cfb-session-removed using step-4 events.js
//
// Top-level await defers element registration until seeding is complete, so
// <cfb-session-loader>.connectedCallback always finds data in the database.

import { CfbTag }               from '../step-1/cfb-tag.js'
import { CfbMenu }             from './cfb-menu.js'
import { CfbSessionCard }       from './cfb-session-card.js'
import { CfbSchedule }          from '../step-3/cfb-schedule.js'
import { CfbBoardOrchestrator } from './cfb-board-orchestrator.js'
import { CfbSessionLoader }     from './cfb-session-loader.js'
import { CfbSessionGenerator }  from '../step-3/cfb-session-generator.js'
import { CfbSessionStore }      from './cfb-session-store.js'
import { seedIfEmpty }          from './session-store.js'

await seedIfEmpty()

customElements.define('cfb-tag',                CfbTag)
customElements.define(CfbMenu.elementName,      CfbMenu)
customElements.define(CfbSessionCard.elementName, CfbSessionCard)
customElements.define('cfb-schedule',           CfbSchedule)
customElements.define('cfb-board-orchestrator', CfbBoardOrchestrator)
customElements.define('cfb-session-loader',     CfbSessionLoader)
customElements.define('cfb-session-generator',  CfbSessionGenerator)
customElements.define('cfb-session-store',      CfbSessionStore)
