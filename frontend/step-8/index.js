// Step 8 - Live updates from backend (WebSocket + random session)

import { CfbTag } from '../step-1/cfb-tag.js'
import { CfbMenu } from '../step-4/cfb-menu.js'
import { CfbSchedule } from '../step-4/cfb-schedule.js'
import { CfbFlipCard } from '../step-5/cfb-flip-card.js'
import { CfbSessionCard } from '../step-5/cfb-session-card.js'
import { CfbSessionType } from '../step-6/cfb-session-type.js'
import { CfbEditSessionForm } from '../step-6/cfb-edit-session-form.js'
import { CfbAddSessionForm } from '../step-6/cfb-add-session-form.js'
import { CfbHeader } from '../step-7/cfb-header.js'
import { CfbScheduleLoader } from '../step-7/cfb-schedule-loader.js'
import { CfbBoardOrchestrator } from './cfb-board-orchestrator.js'
import { CfbSessionLoader } from './cfb-session-loader.js'
import { CfbSessionStoreUpdates } from './cfb-session-store-updates.js'
import { CfbLiveSessionUpdates } from './cfb-live-session-updates.js'
import { CfbInitiateARandomSessionCreation } from './cfb-initiate-a-random-session-creation.js'
import { CfbUpdatesSessions } from './cfb-updates-sessions.js'
import { configureBackendApi } from './lib/api/backend-api.js'

configureBackendApi({ baseUrl: 'http://localhost:3001' })

customElements.define('cfb-tag', CfbTag)
customElements.define(CfbMenu.elementName, CfbMenu)
customElements.define(CfbSchedule.elementName, CfbSchedule)
customElements.define(CfbFlipCard.elementName, CfbFlipCard)
customElements.define(CfbSessionCard.elementName, CfbSessionCard)
customElements.define(CfbEditSessionForm.elementName, CfbEditSessionForm)
customElements.define(CfbSessionType.elementName, CfbSessionType)
customElements.define(CfbAddSessionForm.elementName, CfbAddSessionForm)
customElements.define(CfbBoardOrchestrator.elementName, CfbBoardOrchestrator)
customElements.define(CfbScheduleLoader.elementName, CfbScheduleLoader)
customElements.define(CfbSessionLoader.elementName, CfbSessionLoader)
customElements.define(CfbSessionStoreUpdates.elementName, CfbSessionStoreUpdates)
customElements.define(CfbLiveSessionUpdates.elementName, CfbLiveSessionUpdates)
customElements.define(
  CfbInitiateARandomSessionCreation.elementName,
  CfbInitiateARandomSessionCreation
)
customElements.define(CfbHeader.elementName, CfbHeader)
customElements.define('cfb-updates-sessions', CfbUpdatesSessions)

document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('[data-load-event]')

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const eventId = btn.dataset.loadEvent

      buttons.forEach((b) => b.classList.toggle('active', b === btn))

      document
        .querySelectorAll(
          'cfb-schedule-loader, cfb-session-loader, cfb-live-session-updates, cfb-initiate-a-random-session-creation'
        )
        .forEach((el) => {
          el.setAttribute('data-event-id', eventId)
        })
    })
  })
})
