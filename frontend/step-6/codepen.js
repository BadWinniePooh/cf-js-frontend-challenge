// codepen.js — auto-bundled from step-6
// Entry point: ./frontend/step-6/index.js
// Do not edit manually; regenerate with the codepen-bundle skill.

// ── step-2/lib/builds-session-details.js ────────────────────────────────────

function sessionDetails({
  id,
  title,
  day,
  room,
  tags = [],
  attendees = [],
  startTime,
  sessionType,
} = {}) {
  const base = { id, title, day, room, tags, attendees }
  if (startTime !== undefined) base.startTime = startTime
  if (sessionType !== undefined) base.sessionType = sessionType
  return base
}

// ── step-3/events.js ────────────────────────────────────────────────────────
// [codepen-bundle] duplicate skipped: EventTypes (step-5 defines the full superset)

const cfbSessionCreated = data => new CustomEvent('cfb-session-created', {
  bubbles: true,
  composed: true,
  detail: { ...sessionDetails(data), _type: 'cfb-session-created' },
})

const cfbSessionRemoved = sessionId => new CustomEvent('cfb-session-removed', {
  bubbles: true,
  detail: { sessionId: sessionId },
})

// ── step-4/lib/session-types.js ──────────────────────────────────────────────

function getSessionTypeClass(input){
    console.log('getSessionTypeClass', input)
}

// ── step-4/session-store.js ──────────────────────────────────────────────────

const DB_NAME = 'cfb-db'
const DB_VERSION = 1

let dbPromise = null;

function openDb() {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, _) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("sessions")) {
        db.createObjectStore("sessions", { keyPath: "id" });
      }
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      resolve(db);
    };
  });

  return dbPromise;
}

async function saveSessions(sessions) {
  const db = await openDb();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction("sessions", "readwrite");
    const store = transaction.objectStore("sessions");
    sessions.forEach((session) => {
      store.put(session);
    });
    transaction.oncomplete = () => resolve();
    transaction.onerror = (event) => reject(event.target.error);
  });
}

async function updateSession(session) {
  const db = await openDb();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction("sessions", "readwrite");
    const store = transaction.objectStore("sessions");
    store.put(session);
    transaction.oncomplete = () => resolve();
    transaction.onerror = (event) => reject(event.target.error);
  });
}

async function getAllSessions() {
  const db = await openDb();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction("sessions", "readonly");
    const store = transaction.objectStore("sessions");
    const request = store.getAll();

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

async function deleteSession(id) {
  const db = await openDb();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction("sessions", "readwrite");
    const store = transaction.objectStore("sessions");
    const request = store.delete(id);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

// ── step-4/events.js ────────────────────────────────────────────────────────
// [codepen-bundle] duplicate skipped: cfbSessionCreated, cfbSessionRemoved (already in scope from step-3)
// [codepen-bundle] duplicate skipped: EventTypes (step-5 defines the full superset)

const cfbSessionsLoadedToIDB = () => new CustomEvent('cfb-sessions-loaded-to-idb', {
  bubbles: true,
  composed: true,
  detail: { _type: 'cfb-sessions-loaded-to-idb' },
})

// ── step-1/cfb-tag.js ────────────────────────────────────────────────────────

class CfbTag extends HTMLElement {
    static get observedAttributes() {
        return ['data-label', 'data-color', 'data-count'];
    }

    connectedCallback() {
        this.#render();
    }

    attributeChangedCallback() {
        this.#render();
    }

    #render() {
        const tagLabel = this.dataset.label ?? 'Default';
        const tagColor = this.dataset.color;
        const tagCount = this.dataset.count ?
            ` x${this.dataset.count}`
            : '';

        this.innerHTML = `<span class="cfb-tag${tagColor ? ` cfb-tag--${tagColor}` : ''}">${tagLabel}${tagCount}</span>`;
    }
}

// ── step-4/cfb-schedule.js ───────────────────────────────────────────────────

class CfbSchedule extends HTMLElement {
  #sessions = []

  static get observedAttributes() {
    return ['data-latest-updated-at']
  }

  static definedAttributes = {
    latestUpdatedAt: 'data-latest-updated-at',
  }

  async connectedCallback() {
    this.#sessions = await getAllSessions()
    this.#render()
  }

  async attributeChangedCallback(name, oldValue, newValue) {
    if(oldValue === newValue) return

    if (name === CfbSchedule.definedAttributes.latestUpdatedAt) {
      this.#sessions = await getAllSessions()
      this.#render()
    }
  }

  #render() {
    if (this.#sessions.length === 0) {
      this.#renderPlaceholder()
      return
    }

    const byDay = this.#groupByDay(this.#sessions)

    this.innerHTML = `
            <div class="cfb-board">
                ${Object.entries(byDay).map(([day, daySessions]) => `
                    <section class="cfb-column">
                        <h2 class="cfb-column__heading">${day}</h2>
                        <div class="cfb-column__cards">
                            ${daySessions.map((s) => this.#renderCard(s)).join('')}
                        </div>
                    </section>
                `).join('')}
            </div>
        `
  }

  #renderCard(session) {
    const sessionJson = JSON.stringify(session)
    return `<cfb-session-card data-session-details='${sessionJson}'></cfb-session-card>`
  }

  #groupByDay(sessions) {
    const ORDER = ['Wednesday', 'Thursday', 'Friday']
    return sessions.reduce((acc, s) => {
      if (!acc[s.day]) acc[s.day] = []
      acc[s.day].push(s)
      return acc
    }, Object.fromEntries(
      [...new Set(sessions.map((s) => s.day))]
        .sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b))
        .map((day) => [day, []])
    ))
  }

  #renderPlaceholder() {
    this.innerHTML = `
            <p class="cfb-schedule__placeholder">
                No sessions yet — click the button to add one.
            </p>
        `
  }
}

// ── step-4/cfb-menu.js ───────────────────────────────────────────────────────

class CfbMenu extends HTMLElement {
  static elementName = 'cfb-menu'

  connectedCallback() {
    this.classList.add('cfb-menu')
    const items = [...this.children]

    this.innerHTML = `
      <button class="cfb-card__menu" aria-label="Card options" aria-haspopup="true" aria-expanded="false">
        <span class="cfb-card__menu-icon"></span>
      </button>
      <div class="cfb-card__dropdown" role="menu" hidden></div>
    `

    const dropdown = this.querySelector('.cfb-card__dropdown')
    items.forEach(item => dropdown.appendChild(item))

    this.querySelector('.cfb-card__menu').addEventListener('click', this.#toggleMenu.bind(this))
  }

  disconnectedCallback() {
    this.querySelector('.cfb-card__menu').removeEventListener('click', this.#toggleMenu)
    document.removeEventListener('click', this.#handleOutsideClick)
  }

  #toggleMenu(event) {
    event.stopPropagation()
    const dropdown = this.querySelector('.cfb-card__dropdown')
    const isOpen = !dropdown.hidden

    if (isOpen) {
      this.#closeMenu()
    } else {
      this.#openMenu()
    }
  }

  #openMenu() {
    this.withMenuAndDropdown((menu, dropdown) => {
      dropdown.hidden = false
      this.querySelector('.cfb-card__menu').setAttribute('aria-expanded', 'true')
      document.addEventListener('click', this.#handleOutsideClick)
    })
  }

  #closeMenu() {
    this.withMenuAndDropdown((menu, dropdown) => {
      dropdown.hidden = true
      menu.setAttribute('aria-expanded', 'false')
      document.removeEventListener('click', this.#handleOutsideClick)
    })
  }

  withMenuAndDropdown(cb) {
    const menu = this.querySelector('.cfb-card__menu')
    const dropdown = this.querySelector('.cfb-card__dropdown')
    if (!menu || !dropdown) return
    cb(menu, dropdown)
  }

  #handleOutsideClick = (event) => {
    if (!this.contains(event.target)) {
      this.#closeMenu()
    }
  }
}

// ── step-4/cfb-board-orchestrator.js ─────────────────────────────────────────

class CfbBoardOrchestrator extends HTMLElement {
  #sessions = []

  connectedCallback() {
    this.addEventListener(EventTypes.SESSION_CREATED, this.#addSession)
    this.addEventListener(EventTypes.SESSION_LOADED_TO_IDB, this.#loadSessions)
    this.#updateChildren()
  }

  disconnectedCallback() {
    this.removeEventListener(EventTypes.SESSION_CREATED, this.#addSession)
    this.removeEventListener(EventTypes.SESSION_LOADED_TO_IDB, this.#loadSessions)
  }

  #loadSessions(evt) {
    if (evt.detail._type !== EventTypes.SESSION_LOADED_TO_IDB) return

    this.#sessions = [evt.detail]
    this.#updateChildren();
  }

  #addSession(evt) {
    if (evt.detail._type !== EventTypes.SESSION_CREATED) return

    this.#sessions = [...this.#sessions, evt.detail]
    this.#updateChildren()
  }

  #updateChildren() {
    this.querySelectorAll('[listens-schedule-update]').forEach(listener => {
      const tagName = listener.tagName.toLowerCase();
      const schedule = this.querySelector(tagName);

      schedule.setAttribute('data-sessions', JSON.stringify(this.#sessions))
      schedule.setAttribute('data-latest-updated-at', Date.now())
    })
  }
}

// ── step-4/cfb-session-loader.js ─────────────────────────────────────────────

class CfbSessionLoader extends HTMLElement {
  async connectedCallback() {
    let sessionsInDb = await getAllSessions()
    console.log('Sessions already in DB:', sessionsInDb)
    if(sessionsInDb.length === 0) {
      await saveSessions(SEED_SESSIONS)
    }
    this.dispatchEvent(cfbSessionsLoadedToIDB())
  }
}

const SEED_SESSIONS = [
  {
    id: 'cf25-1',
    title: 'Opening Keynote',
    day: 'Wednesday',
    room: 'Main Hall',
    tags: [{ label: 'Keynote', color: 'blue' }],
    attendees: [
      { initials: 'AK', name: 'Alice Kent' },
      { initials: 'JS', name: 'James Smith' },
    ],
    sessionType: 'Keynote',
  },
  {
    id: 'cf25-2',
    title: 'Web Components Deep Dive',
    day: 'Wednesday',
    room: 'Track A',
    tags: [
      { label: 'Frontend', color: 'green' },
      { label: 'Workshop', color: 'orange' },
    ],
    attendees: [
      { initials: 'TL', name: 'Thomas Lee' },
      { initials: 'PK', name: 'Priya Kapoor' },
    ],
    sessionType: 'Workshop',
  },
  {
    id: 'cf25-3',
    title: 'TDD in the Browser',
    day: 'Thursday',
    room: 'Track B',
    tags: [{ label: 'Testing', color: 'purple' }],
    attendees: [
      { initials: 'AK', name: 'Alice Kent' },
      { initials: 'HV', name: 'Henry Vance' },
      { initials: 'JO', name: 'Julia Owen' },
    ],
    sessionType: 'Talk',
  },
  {
    id: 'cf25-4',
    title: 'IndexedDB Patterns',
    day: 'Thursday',
    room: 'Track A',
    tags: [
      { label: 'Frontend', color: 'green' },
      { label: 'Data', color: 'red' },
    ],
    attendees: [
      { initials: 'MR', name: 'Maria Rodriguez' },
    ],
    sessionType: 'Talk',
  },
  {
    id: 'cf25-5',
    title: 'Accessibility by Default',
    day: 'Friday',
    room: 'Track A',
    tags: [{ label: 'A11y', color: 'green' }],
    attendees: [
      { initials: 'LM', name: 'Liam Miller' },
      { initials: 'KR', name: 'Kara Reed' },
    ],
  },
  {
    id: 'cf25-6',
    title: 'Closing Panel',
    day: 'Friday',
    room: 'Main Hall',
    tags: [{ label: 'Keynote', color: 'blue' }],
    attendees: [
      { initials: 'AK', name: 'Alice Kent' },
      { initials: 'JS', name: 'James Smith' },
      { initials: 'TL', name: 'Thomas Lee' },
    ],
  },
]

// ── step-5/events.js ─────────────────────────────────────────────────────────
// [codepen-bundle] duplicate skipped: cfbSessionCreated, cfbSessionRemoved, cfbSessionsLoadedToIDB (already in scope)
// EventTypes defined here as the full superset of step-3 and step-4 versions.

const EventTypes = {
  SESSION_CREATED: 'cfb-session-created',
  SESSION_REMOVED: 'cfb-session-removed',
  SESSION_LOADED_TO_IDB: 'cfb-sessions-loaded-to-idb',
  SESSION_UPDATED: 'cfb-session-updated',
}

const cfbSessionUpdated = session =>
  new CustomEvent(EventTypes.SESSION_UPDATED, {
    bubbles: true,
    composed: true,
    detail: { ...sessionDetails(session), _type: EventTypes.SESSION_UPDATED },
  })

// ── step-5/lib/label-to-color.js ─────────────────────────────────────────────

const KNOWN_TAGS = [
  { label: 'Frontend', color: 'green' },
  { label: 'Backend', color: 'red' },
  { label: 'Architecture', color: 'blue' },
  { label: 'Testing', color: 'purple' },
  { label: 'Keynote', color: 'blue' },
  { label: 'Workshop', color: 'orange' },
  { label: 'A11y', color: 'green' },
  { label: 'Data', color: 'red' },
  { label: 'Talk', color: 'orange' },
]

const labelToColor = label => {
  const match = KNOWN_TAGS.find(t => t.label.toLowerCase() === label.toLowerCase())
  return match?.color ?? 'blue'
}

const isKnownTag = label =>
  KNOWN_TAGS.some(t => t.label.toLowerCase() === label.toLowerCase())

// ── step-5/lib/speaker.js ────────────────────────────────────────────────────

function parseSpeaker(raw) {
  const name = raw.trim();
  if (!name) return [];
  const initials = name
    .split(/\s+/)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
  return [{ initials, name }];
}

function parseSpeakers(raw) {
    return raw.split(", ").map(s => parseSpeaker(s)).flat();
}

function speakersToString(speakers) {
    return speakers.map(s => s.name).join(", ");
}

// ── step-5/lib/tag-chips.js ──────────────────────────────────────────────────

class TagChipController {
  #tags = [];
  #root;

  constructor(root) {
    this.#root = root;
  }

  get tags() {
    return [...this.#tags];
  }

  setTags(labels) {
    this.#tags = [...labels];
    this.#update();
  }

  reset() {
    this.#tags = [];
    this.#update();
  }

  bind() {
    this.#addBtn().addEventListener('click', this.#onAdd);
    this.#input().addEventListener('keydown', this.#onKeydown);
  }

  unbind() {
    this.#addBtn().removeEventListener('click', this.#onAdd);
    this.#input().removeEventListener('keydown', this.#onKeydown);
  }

  #input  = () => this.#root.querySelector('[data-tag-input]');
  #chips  = () => this.#root.querySelector('[data-tag-chips]');
  #addBtn = () => this.#root.querySelector('[data-tag-add]');
  #hidden = () => this.#root.querySelector('input[name="tags"]');

  #onAdd = () => {
    const input = this.#input();
    const label = input.value.trim();
    if (!label || this.#tags.includes(label)) { input.value = ''; return; }
    this.#tags.push(label);
    input.value = '';
    this.#update();
  };

  #onKeydown = (evt) => {
    if (evt.key === 'Enter') { evt.preventDefault(); this.#onAdd(); }
  };

  #update() {
    const chips = this.#chips();
    if (!chips) return;
    chips.innerHTML = this.#tags
      .map((tag) => `
        <span class="cfb-chip" data-tag="${tag}">
          ${tag}
          <button type="button" class="cfb-chip__remove" aria-label="Remove ${tag}">×</button>
        </span>`)
      .join('');
    chips.querySelectorAll('.cfb-chip__remove').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.#tags = this.#tags.filter((t) => t !== btn.closest('[data-tag]').dataset.tag);
        this.#update();
      });
    });
    this.#hidden().value = this.#tags.join(',');
  }
}

// ── step-5/cfb-session-store.js ──────────────────────────────────────────────

class CfbSessionStore extends HTMLElement {
    connectedCallback() {
        this.addEventListener(EventTypes.SESSION_CREATED,  this.#onSessionCreated)
        this.addEventListener(EventTypes.SESSION_UPDATED,  this.#onSessionUpdated)
        this.addEventListener(EventTypes.SESSION_REMOVED, this.#onSessionRemoved)
    }

    disconnectedCallback() {
        this.removeEventListener(EventTypes.SESSION_CREATED,  this.#onSessionCreated)
        this.removeEventListener(EventTypes.SESSION_UPDATED,  this.#onSessionUpdated)
        this.removeEventListener(EventTypes.SESSION_REMOVED, this.#onSessionRemoved)
    }

    #onSessionCreated = async e => {
        await saveSessions([e.detail])
        await this.#broadcastSessions()
    }

    #onSessionUpdated = async e => {
        await updateSession(e.detail)
        await this.#broadcastSessions()
    }

    #onSessionRemoved = async e => {
        await deleteSession(e.detail.sessionId)
        await this.#broadcastSessions()
    }

    async #broadcastSessions() {
        const sessions = await getAllSessions()
        this.dispatchEvent(cfbSessionsLoadedToIDB())
    }
}

// ── step-5/cfb-flip-card.js ──────────────────────────────────────────────────

const SHADOW_CSS = `
    :host {
        display: block;
    }

    :host(.is-flipping) {
        border-radius: 0.5rem;
        box-shadow:    0 12px 40px rgba(0, 0, 0, 0.25);
        transition:
            top    0.45s cubic-bezier(0.4, 0, 0.2, 1),
            left   0.45s cubic-bezier(0.4, 0, 0.2, 1),
            width  0.45s cubic-bezier(0.4, 0, 0.2, 1),
            height 0.45s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .scene {
        perspective: 1200px;
    }

    :host(.is-flipping) .scene,
    :host(.is-flipping) .inner {
        height: 100%;
    }

    .inner {
        position:        relative;
        transform-style: preserve-3d;
        transition:      transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }

    :host(.is-flipped) .inner {
        transform: rotateY(180deg);
    }

    .face {
        backface-visibility:         hidden;
        -webkit-backface-visibility: hidden;
    }

    .face--back {
        position:   absolute;
        inset:      0;
        transform:  rotateY(180deg);
        overflow-y: auto;
        border-radius: 0.5rem;
    }
`

class CfbFlipCard extends HTMLElement {
    static elementName = 'cfb-flip-card'

    #backdrop  = null
    #savedRect = null

    constructor() {
        super()
        const root = this.attachShadow({ mode: 'open' })
        root.innerHTML = `
            <style>${SHADOW_CSS}</style>
            <div class="scene">
                <div class="inner">
                    <div class="face face--front">
                        <slot name="front"></slot>
                    </div>
                    <div class="face face--back">
                        <slot name="back"></slot>
                    </div>
                </div>
            </div>
        `
    }

    disconnectedCallback() {
        this.#backdrop?.remove()
    }

    flip() {
        this.#savedRect = this.getBoundingClientRect()
        const { top, left, width, height } = this.#savedRect

        this.#backdrop = document.createElement('div')
        this.#backdrop.className = 'cfb-card-flip__backdrop'
        document.body.appendChild(this.#backdrop)
        this.#backdrop.addEventListener('click', () => this.unflip())

        Object.assign(this.style, {
            position: 'fixed',
            top:      `${top}px`,
            left:     `${left}px`,
            width:    `${width}px`,
            height:   `${height}px`,
            zIndex:   '200',
            margin:   '0',
        })
        this.classList.add('is-flipping')

        this.offsetHeight

        const targetW = Math.min(400, window.innerWidth  * 0.92)
        const targetH = Math.min(560, window.innerHeight * 0.88)
        const targetL = (window.innerWidth  - targetW) / 2
        const targetT = Math.max(16, (window.innerHeight - targetH) / 2)

        requestAnimationFrame(() => {
            Object.assign(this.style, {
                top:    `${targetT}px`,
                left:   `${targetL}px`,
                width:  `${targetW}px`,
                height: `${targetH}px`,
            })
            this.classList.add('is-flipped')
            this.#backdrop.classList.add('is-visible')
        })
    }

    unflip(callback = null) {
        this.classList.remove('is-flipped')
        this.#backdrop?.classList.remove('is-visible')

        const { top, left, width, height } = this.#savedRect ?? {}
        if (top != null) {
            requestAnimationFrame(() => {
                Object.assign(this.style, { top: `${top}px`, left: `${left}px`,
                                            width: `${width}px`, height: `${height}px` })
            })
        }

        const inner = this.shadowRoot.querySelector('.inner')
        const onDone = () => {
            inner.removeEventListener('transitionend', onDone)

            this.style.cssText = ''
            this.classList.remove('is-flipping')
            this.#backdrop?.remove()
            this.#backdrop  = null
            this.#savedRect = null

            callback?.()
        }
        inner.addEventListener('transitionend', onDone)
    }
}

// ── step-5/cfb-session-card.js ───────────────────────────────────────────────

function escapeAttr(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/"/g, '&quot;')
}

class CfbSessionCard extends HTMLElement {
  static elementName = 'cfb-session-card'
  static definedAttributes = { details: 'data-session-details' }

  #sessionDetails = null

  static get observedAttributes() {
    return [CfbSessionCard.definedAttributes.details]
  }

  connectedCallback() {
    this.addEventListener('cfb-session-updated', this.#onEditSaved);
    this.addEventListener('cfb-edit-cancelled', this.#onEditCancelled);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (newValue === oldValue) return
    if (name === CfbSessionCard.definedAttributes.details) {
      this.#sessionDetails = JSON.parse(newValue)
      this.#render(this.#sessionDetails)
    }
  }

  disconnectedCallback() {
    this.removeEventListener('cfb-session-updated', this.#onEditSaved);
    this.removeEventListener('cfb-edit-cancelled', this.#onEditCancelled);
  }

  #render(sessionDetails) {
    const tags = sessionDetails.tags
      .map(tag => `<cfb-tag data-label="${tag.label}" data-color="${tag.color}"></cfb-tag>`)

    const avatars = sessionDetails.attendees
      .map(attendee => `<div class="cfb-avatar" aria-label="${attendee.name}">${attendee.initials}</div>`)

    const sessionType = sessionDetails.sessionType?.trim() ?? ''
    const hasSessionType = Boolean(sessionType)
    const articleClasses = [
      'cfb-card',
      hasSessionType && 'cfb-card--session-type',
      getSessionTypeClass(sessionType)
    ].filter(Boolean).join(' ')

    const articleAria = hasSessionType
      ? ` aria-label="${escapeAttr(`${sessionDetails.title}. Session type: ${sessionType}.`)}"`
      : ''

    const titleAriaHidden = hasSessionType ? ' aria-hidden="true"' : ''

    this.innerHTML = `
    <cfb-flip-card>
      <article slot="front" class="${articleClasses}" ${articleAria} role="article">
        <header class="cfb-card__header">
          <span class="cfb-card__title"${titleAriaHidden}><span class="cfb-card__title-text">${sessionDetails.title}</span></span>
          <cfb-menu>
            <button class="cfb-card__dropdown-item" role="menuitem" data-action="edit">Edit</button>
            <button class="cfb-card__dropdown-item cfb-card__dropdown-item--danger" role="menuitem" data-action="remove">Remove</button>
          </cfb-menu>
        </header>
        <div class="cfb-card__tags"> ${tags.join('')} </div>
        <div> ${sessionType} </div>
        <footer>
          <div class="cfb-avatars" aria-label="Attendees"> ${avatars.join('')} </div>
        </footer>
      </article>

      <cfb-edit-session-form slot="back"></cfb-edit-session-form>
    </cfb-flip-card>`

    this.querySelector('[data-action="edit"]').addEventListener('click', () => {
      this.querySelector('cfb-edit-session-form').populate(this.#sessionDetails)
      this.querySelector('cfb-flip-card').flip()
    })

    this.querySelector('[data-action="remove"]').addEventListener('click', () => {
      this.dispatchEvent(cfbSessionRemoved(this.#sessionDetails.id))
    })
  }

  #onEditSaved = (evt) => {
    if (evt.target === this) return
    evt.stopPropagation()
    this.querySelector('cfb-flip-card').unflip(() => {
      this.#sessionDetails = evt.detail
      this.#render(this.#sessionDetails)
      this.dispatchEvent(new CustomEvent(evt.type, {
        bubbles: true,
        composed: true,
        detail: evt.detail,
      }))
    })
  }

  #onEditCancelled = () => {
    this.querySelector('cfb-flip-card').unflip(() => {
      this.querySelector('cfb-edit-session-form').reset()
    })
  }
}

// ── step-6/lib/session-types.js ──────────────────────────────────────────────

const SessionTypes = {
    talk: { icon: '🎤', label: 'Talk', name: 'talk' },
    workshop: { icon: '🛠️', label: 'Workshop', name: 'workshop' },
    keynote: { icon: '👥', label: 'Keynote', name: 'keynote' },
    lightning: { icon: '⚡', label: 'Lightning Talk', name: 'lightning' },
}

// ── step-6/lib/session-form-fields.js ────────────────────────────────────────

const DAYS = ['Wednesday', 'Thursday', 'Friday'];
const ROOMS = ['Main Hall', 'Track A', 'Track B', 'Workshop Room'];
const SESSION_TYPES = Object.values(SessionTypes).map((t) => t.name);

function sessionFormFields(idPrefix, cssPrefix) {
  const p = cssPrefix;
  return `
    <div class="${p}__field">
      <label for="${idPrefix}-title" class="${p}__label">Title</label>
      <input id="${idPrefix}-title" class="${p}__input"
        name="title" type="text" required minlength="5" />
    </div>

    <div class="${p}__field">
      <label for="${idPrefix}-day" class="${p}__label">Day</label>
      <select id="${idPrefix}-day" class="${p}__select" name="day" required>
        <option value="">Select a day…</option>
        ${DAYS.map((d) => `<option value="${d}">${d}</option>`).join('')}
      </select>
    </div>

    <div class="${p}__field">
      <label for="${idPrefix}-room" class="${p}__label">Room</label>
      <input id="${idPrefix}-room" class="${p}__input"
        name="room" type="text" list="${idPrefix}-room-list" required autocomplete="off" />
      <datalist id="${idPrefix}-room-list">
        ${ROOMS.map((r) => `<option value="${r}"></option>`).join('')}
      </datalist>
    </div>

    <fieldset class="${p}__fieldset">
      <legend class="${p}__legend">Session type</legend>
      ${SESSION_TYPES.map((t) => `
          <cfb-session-type name="session-type" value="${t.toLowerCase()}" required></cfb-session-type>
        `).join('')}
    </fieldset>

    <div class="${p}__field">
      <label for="${idPrefix}-tag-input" class="${p}__label">
        Tags <span class="${p}__optional">(optional)</span>
      </label>
      <div class="${p}__tag-row">
        <input id="${idPrefix}-tag-input" class="${p}__input"
          type="text" list="${idPrefix}-tag-list" placeholder="Add a tag…" autocomplete="off"
          data-tag-input />
        <datalist id="${idPrefix}-tag-list">
          ${KNOWN_TAGS.map((t) => `<option value="${t.label}"></option>`).join('')}
        </datalist>
        <button type="button" class="${p}__add-tag-btn" data-tag-add>Add</button>
      </div>
      <div class="${p}__tag-chips" data-tag-chips></div>
      <input type="hidden" name="tags" value="" />
    </div>

    <div class="${p}__field">
      <label for="${idPrefix}-speaker" class="${p}__label">
        Speaker <span class="${p}__optional">(optional)</span>
      </label>
      <input id="${idPrefix}-speaker" class="${p}__input" name="speaker" type="text" />
    </div>
  `;
}

// ── step-6/cfb-session-type.js ───────────────────────────────────────────────

class CfbSessionType extends HTMLElement {
  static elementName = "cfb-session-type";
  static formAssociated = true;

  constructor() {
    super();
    this._internals = this.attachInternals();
  }

  connectedCallback() {
    this.addEventListener("click", this.#onClick);
    this._value = this.getAttribute("value") ?? "talk";
    this.#renderTile(this._value);
    this.#updateValidity();
  }

  formResetCallback() {
    this._selected = false;
    this._internals.setFormValue(null);
    this._updateUI();
    this.#updateValidity();
  }

  set checked(val) {
    this._selected = !!val;
    this._internals.setFormValue(this._selected ? this._value : null);
    this._updateUI();
    this.#updateValidity();
  }

  #onClick() {
    const name = this.getAttribute("name");
    this._internals.form
      ?.querySelectorAll(`cfb-session-type[name="${name}"]`)
      .forEach((el) => {
        if (el !== this) el.checked = false;
      });

    console.log(name, "clicked");

    this._selected = !this._selected;
    this._internals.setFormValue(this._selected ? this._value : null);
    this._updateUI();
    this.#updateValidity();
  }

  _updateUI() {
    this.querySelector(".cfb-session-type__tile")?.classList.toggle(
      "cfb-session-type__tile--selected",
      !!this._selected,
    );
  }

  #renderTile(sessionType) {
    const { icon, label } = SessionTypes[sessionType];
    this.innerHTML = `
      <div class="cfb-session-type__tile">
        <span class="cfb-session-type__icon">${icon}</span>
        <span class="cfb-session-type__label">${label}</span>
      </div>
    `;
  }

  #updateValidity() {
    if (this.required && !this._selected) {
      this._internals.setValidity(
        { valueMissing: true },
        "Please select a session type",
        this.querySelector(".cfb-session-type__tile"),
      );
    } else {
      this._internals.setValidity({});
    }
  }
}

// ── step-6/cfb-add-session-form.js ───────────────────────────────────────────

class CfbAddSessionForm extends HTMLElement {
  static elementName = "cfb-add-session-form";

  #tagCtrl = new TagChipController(this);

  connectedCallback() {
    this.#render();
    this.addEventListener("submit", this.#onSubmit);
    this.#trigger().addEventListener("click", this.#onTriggerClick);
    this.#dialog().addEventListener("click", this.#onBackdropClick);
    this.#dialog().addEventListener("close", this.#onDialogClose);
    this.#cancelBtn().addEventListener("click", this.#onClose);
    this.#tagCtrl.bind();
  }

  disconnectedCallback() {
    this.removeEventListener("submit", this.#onSubmit);
    this.#trigger().removeEventListener("click", this.#onTriggerClick);
    this.#dialog().removeEventListener("click", this.#onBackdropClick);
    this.#dialog().removeEventListener("close", this.#onDialogClose);
    this.#cancelBtn().removeEventListener("click", this.#onClose);
    this.#tagCtrl.unbind();
  }

  #dialog    = () => this.querySelector("dialog");
  #trigger   = () => this.querySelector(".cfb-add-session-form__trigger");
  #cancelBtn = () => this.querySelector(".cfb-add-session-form__cancel");

  #onTriggerClick = () => this.#dialog().showModal();

  #onBackdropClick = (evt) => {
    if (evt.target === this.#dialog()) this.#dialog().close();
  };

  #onClose = () => this.#dialog().close();

  #onDialogClose = () => {
    this.querySelector("form")?.reset();
    this.#tagCtrl.reset();
  };

  #onSubmit = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();

    const form = this.querySelector("form");
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = new FormData(form);
    const event = cfbSessionCreated(
      sessionDetails({
        id: crypto.randomUUID(),
        title: data.get("title"),
        day: data.get("day"),
        room: data.get("room"),
        sessionType: data.get("session-type"),
        tags: this.#tagCtrl.tags.map((label) => ({ label, color: labelToColor(label) })),
        attendees: parseSpeakers(data.get("speaker") ?? ""),
      })
    );

    this.dispatchEvent(event);
    this.#dialog().close();
  };

  #render() {
    this.innerHTML = `
      <button class="cfb-add-session-form__trigger" aria-haspopup="dialog">
        + Add Session
      </button>
      <dialog class="cfb-add-session-form__dialog" aria-label="Add a new session">
        <div class="cfb-add-session-form__card">
          <form class="cfb-add-session-form__form">
            <h2 class="cfb-add-session-form__heading">Add a new session</h2>

            ${sessionFormFields('cfb-add', 'cfb-add-session-form')}

            <div class="cfb-add-session-form__actions">
              <button type="button" class="cfb-add-session-form__cancel">Cancel</button>
              <button type="submit" class="cfb-add-session-form__submit">Add Session</button>
            </div>
          </form>
        </div>
      </dialog>
    `;
  }
}

// ── step-6/cfb-edit-session-form.js ──────────────────────────────────────────

class CfbEditSessionForm extends HTMLElement {
  static elementName = "cfb-edit-session-form";

  #session = null;
  #tagCtrl = new TagChipController(this);

  connectedCallback() {
    this.#render();
    this.addEventListener("submit", this.#onSubmit);
    this.#cancelBtn().addEventListener("click", this.#onCancel);
    this.#tagCtrl.bind();
  }

  disconnectedCallback() {
    this.removeEventListener("submit", this.#onSubmit);
    this.#cancelBtn().removeEventListener("click", this.#onCancel);
    this.#tagCtrl.unbind();
  }

  populate(session) {
    this.#session = session;
    this.#tagCtrl.setTags(session.tags.map((t) => t.label));

    this.querySelector('[name="title"]').value = session.title;
    this.querySelector('[name="day"]').value = session.day ?? "";
    this.querySelector('[name="room"]').value = session.room ?? "";

    this.querySelectorAll('cfb-session-type[name="session-type"]')
      .forEach(el => { el.checked = el.getAttribute('value') === session.sessionType; });

    this.querySelector('[name="speaker"]').value = speakersToString(session.attendees);
  }

  reset() {
    this.querySelector("form")?.reset();
    this.#session = null;
    this.#tagCtrl.reset();
  }

  #cancelBtn = () => this.querySelector(".cfb-edit-form__cancel");

  #onSubmit = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();

    const form = this.querySelector("form");
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = new FormData(form);
    const speaker = data.get("speaker")?.trim() ?? "";
    const attendees = speaker ? parseSpeakers(speaker) : this.#session.attendees;

    const event = cfbSessionUpdated(
      sessionDetails({
        id: this.#session.id,
        title: data.get("title"),
        day: data.get("day"),
        room: data.get("room"),
        sessionType: data.get("session-type"),
        tags: this.#tagCtrl.tags.map((label) => ({ label, color: labelToColor(label) })),
        attendees,
      })
    );

    this.dispatchEvent(event);
  };

  #onCancel = () => {
    this.dispatchEvent(new CustomEvent("cfb-edit-cancelled", { bubbles: true }));
  };

  #render() {
    this.innerHTML = `
      <form class="cfb-edit-form">
        <header class="cfb-edit-form__header">
          <h3 class="cfb-edit-form__title">Edit Session</h3>
        </header>

        <div class="cfb-edit-form__body">
          ${sessionFormFields('cfb-edit', 'cfb-edit-session-form')}
        </div>

        <footer class="cfb-edit-form__actions">
          <button type="button" class="cfb-edit-form__cancel">Cancel</button>
          <button type="submit" class="cfb-edit-form__save">Save changes</button>
        </footer>
      </form>
    `;
  }
}

// ── step-6/index.js ──────────────────────────────────────────────────────────

customElements.define(CfbSessionType.elementName,      CfbSessionType)
customElements.define('cfb-tag',                       CfbTag)
customElements.define(CfbMenu.elementName,             CfbMenu)
customElements.define(CfbFlipCard.elementName,         CfbFlipCard)
customElements.define(CfbSessionCard.elementName,      CfbSessionCard)
customElements.define(CfbEditSessionForm.elementName,  CfbEditSessionForm)
customElements.define('cfb-schedule',                  CfbSchedule)
customElements.define('cfb-board-orchestrator',        CfbBoardOrchestrator)
customElements.define('cfb-session-loader',            CfbSessionLoader)
customElements.define('cfb-session-store',             CfbSessionStore)
customElements.define(CfbAddSessionForm.elementName,   CfbAddSessionForm)
