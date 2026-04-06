// Step 5 — Add a Session via a Form + Edit via card flip
//
// Everything from Step 4 carries over unchanged.
// Three new pieces:
//   <cfb-flip-card>          — generic 2-sided card (Shadow DOM); exposes flip()/unflip()
//   <cfb-add-session-form>   — fixed trigger button → <dialog> overlay to add a session
//   <cfb-edit-session-form>  — lives in the "back" slot of <cfb-flip-card>

import { CfbTag }               from '../step-1/cfb-tag.js'
import { CfbMenu }              from '../step-4/cfb-menu.js'
import { CfbSchedule }          from '../step-4/cfb-schedule.js'
import { CfbBoardOrchestrator } from '../step-4/cfb-board-orchestrator.js'
import { CfbSessionLoader }     from '../step-4/cfb-session-loader.js'
import { CfbFlipCard }          from './cfb-flip-card.js'
import { CfbSessionCard }       from './cfb-session-card.js'
import { CfbSessionStore }      from './cfb-session-store.js'
import { CfbAddSessionForm }    from './cfb-add-session-form.js'
import { CfbEditSessionForm }   from './cfb-edit-session-form.js'

customElements.define('cfb-tag',                     CfbTag)
customElements.define(CfbMenu.elementName,            CfbMenu)
customElements.define(CfbFlipCard.elementName,        CfbFlipCard)
customElements.define(CfbSessionCard.elementName,     CfbSessionCard)
customElements.define(CfbEditSessionForm.elementName, CfbEditSessionForm)
customElements.define('cfb-schedule',                 CfbSchedule)
customElements.define('cfb-board-orchestrator',       CfbBoardOrchestrator)
customElements.define('cfb-session-loader',           CfbSessionLoader)
customElements.define('cfb-session-store',            CfbSessionStore)
customElements.define(CfbAddSessionForm.elementName,  CfbAddSessionForm)
