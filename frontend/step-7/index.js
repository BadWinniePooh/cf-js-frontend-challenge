// Step 7 - Load from Backend


/*
 * This is Important!
 *  If you want to try to use MSW instead of the step-7-be backend,
 *  you can uncomment the following lines and comment out the configureBackendApi line.
 *  Also read the 'getting-started.md' for more details on MSW.
 */
// import { worker } from './mocks/browser.js'
// await worker().start({ onUnhandledRequest: 'warn' })


import { CfbTag } from '../step-1/cfb-tag.js'
import { CfbMenu } from '../step-4/cfb-menu.js'
import { CfbSchedule } from '../step-4/cfb-schedule.js'
import { CfbFlipCard } from '../step-5/cfb-flip-card.js'
import { CfbSessionCard } from '../step-5/cfb-session-card.js'
import { CfbSessionType } from '../step-6/cfb-session-type.js'
import { CfbEditSessionForm } from '../step-6/cfb-edit-session-form.js'
import { CfbBoardOrchestrator } from './cfb-board-orchestrator.js'
import { CfbScheduleLoader } from './cfb-schedule-loader.js'
import { CfbSessionLoader } from './cfb-session-loader.js'
import { CfbHeader } from './cfb-header.js'
import { CfbUpdatesSessions } from './cfb-updates-sessions.js'
import { CfbAddSessionForm } from '../step-6/cfb-add-session-form.js'
import { configureBackendApi } from './lib/api/backend-api.js'

configureBackendApi({ baseUrl: 'http://localhost:3001' })

customElements.define('cfb-tag', CfbTag)
customElements.define(CfbMenu.elementName, CfbMenu)
customElements.define(CfbSchedule.elementName, CfbSchedule)
customElements.define(CfbFlipCard.elementName, CfbFlipCard)
customElements.define(CfbSessionCard.elementName, CfbSessionCard)
customElements.define(CfbEditSessionForm.elementName, CfbEditSessionForm)
customElements.define(CfbSessionType.elementName, CfbSessionType)
customElements.define('cfb-board-orchestrator', CfbBoardOrchestrator)
customElements.define('cfb-schedule-loader', CfbScheduleLoader)
customElements.define('cfb-session-loader', CfbSessionLoader)
customElements.define('cfb-header', CfbHeader)
customElements.define('cfb-updates-sessions', CfbUpdatesSessions)
customElements.define(CfbAddSessionForm.elementName, CfbAddSessionForm)

// ─── Event-switcher buttons ───────────────────────────────────────────────────
// Wire the control buttons to swap the data-event-id on all three elements.

document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('[data-load-event]')

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const eventId = btn.dataset.loadEvent

      // Mark the active button
      buttons.forEach((b) => b.classList.toggle('active', b === btn))

      // Update all three elements - loaders will re-fetch, orchestrator
      // will wait for both to complete, then notify cfb-schedule.
      const loaders = document.querySelectorAll(
        'cfb-schedule-loader, cfb-session-loader'
      )
      loaders.forEach((el) => {
        el.setAttribute('data-event-id', eventId)
      })

      // Loaders drive the flow; orchestrator propagates event-id and update signals.
    })
  })
})
