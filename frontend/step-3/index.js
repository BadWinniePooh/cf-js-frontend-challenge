// Step 3 — <cfb-board-orchestrator> · Pub/Sub

import { CfbTag } from '../step-1/cfb-tag.js'
import { CfbSessionGenerator } from './cfb-session-generator.js'
import { CfbBoardOrchestrator } from './cfb-board-orchestrator.js'
import { CfbSchedule } from './cfb-schedule.js'
import { CfbSessionCard } from '../step-2/cfb-session-card.js'

customElements.define(CfbSessionCard.elementName, CfbSessionCard)
customElements.define('cfb-tag', CfbTag)
customElements.define('cfb-session-generator', CfbSessionGenerator)
customElements.define('cfb-board-orchestrator', CfbBoardOrchestrator)
customElements.define('cfb-schedule', CfbSchedule)
