import { http, HttpResponse } from 'msw'

// ─── Fixture data ─────────────────────────────────────────────────────────────

const SCHEDULES = {
    'codefreeze-2025': {
        eventId: 'codefreeze-2025',
        name: 'CodeFreeze 2025',
        location: 'Kiilopää, Finland',
        date: '2025-01-15',
    },
    'devdays-2025': {
        eventId: 'devdays-2025',
        name: 'DevDays 2025',
        location: 'Helsinki, Finland',
        date: '2025-06-10',
    },
}

const INITIALS_AND_NAMES = [
    { 'initials': 'AK', 'name': 'Alice Kent' },
    { 'initials': 'JS', 'name': 'James Smith' },
    { 'initials': 'MR', 'name': 'Maria Rodriguez' },
    { 'initials': 'TL', 'name': 'Thomas Lee' },
    { 'initials': 'PK', 'name': 'Priya Kapoor' },
    { 'initials': 'HV', 'name': 'Henry Vance' },
    { 'initials': 'JO', 'name': 'Julia Owen' },
    { 'initials': 'LM', 'name': 'Liam Miller' },
    { 'initials': 'KR', 'name': 'Kara Reed' },
    { 'initials': 'SS', 'name': 'Sophia Scott' }
]
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

const SESSIONS = {
    'codefreeze-2025': [
        {
            id: 'cf25-1',
            eventId: 'codefreeze-2025',
            title: 'MSW: Opening Keynote',
            day: 'Wednesday',
            room: 'Main Hall',
            tags: [{ label: 'Keynote', color: 'blue' }],
            attendees: [pick(INITIALS_AND_NAMES), pick(INITIALS_AND_NAMES), pick(INITIALS_AND_NAMES)].filter(
              (v, i, a) => a.indexOf(v) === i   // deduplicate
            ),
        },
        {
            id: 'cf25-2',
            eventId: 'codefreeze-2025',
            title: 'MSW: Web Components Deep Dive',
            day: 'Wednesday',
            room: 'Track A',
            tags: [
                { label: 'Frontend', color: 'green' },
                { label: 'Workshop', color: 'orange' },
            ],
            attendees: [pick(INITIALS_AND_NAMES), pick(INITIALS_AND_NAMES)].filter(
              (v, i, a) => a.indexOf(v) === i   // deduplicate
            ),
        },
        {
            id: 'cf25-3',
            eventId: 'codefreeze-2025',
            title: 'MSW: TDD in the Browser',
            day: 'Thursday',
            room: 'Track B',
            tags: [{ label: 'Testing', color: 'purple' }],
            attendees: [pick(INITIALS_AND_NAMES), pick(INITIALS_AND_NAMES), pick(INITIALS_AND_NAMES)].filter(
              (v, i, a) => a.indexOf(v) === i   // deduplicate
            ),
        },
        {
            id: 'cf25-4',
            eventId: 'codefreeze-2025',
            title: 'MSW: IndexedDB Patterns',
            day: 'Thursday',
            room: 'Track A',
            tags: [
                { label: 'Frontend', color: 'green' },
                { label: 'Data', color: 'red' },
            ],
            attendees: [pick(INITIALS_AND_NAMES)].filter(
              (v, i, a) => a.indexOf(v) === i   // deduplicate
            ),
        },
        {
            id: 'cf25-5',
            eventId: 'codefreeze-2025',
            title: 'MSW: Closing Panel',
            day: 'Friday',
            room: 'Main Hall',
            tags: [{ label: 'Keynote', color: 'blue' }],
            attendees: [pick(INITIALS_AND_NAMES), pick(INITIALS_AND_NAMES), pick(INITIALS_AND_NAMES), pick(INITIALS_AND_NAMES)].filter(
              (v, i, a) => a.indexOf(v) === i   // deduplicate
            ),
        },
    ],
    'devdays-2025': [
        {
            id: 'dd25-1',
            eventId: 'devdays-2025',
            title: 'State of the Web Platform',
            day: 'Tuesday',
            room: 'Auditorium',
            tags: [{ label: 'Keynote', color: 'blue' }],
            attendees: ['SS', 'AM'],
        },
        {
            id: 'dd25-2',
            eventId: 'devdays-2025',
            title: 'Accessibility by Default',
            day: 'Tuesday',
            room: 'Track 1',
            tags: [
                { label: 'A11y', color: 'green' },
                { label: 'Talk', color: 'orange' },
            ],
            attendees: ['LM', 'KR'],
        },
        {
            id: 'dd25-3',
            eventId: 'devdays-2025',
            title: 'Progressive Enhancement Workshop',
            day: 'Wednesday',
            room: 'Track 2',
            tags: [{ label: 'Workshop', color: 'orange' }],
            attendees: ['SS', 'KR', 'JN'],
        },
    ],
}

const timeout = (min = 0, interval = 1000 ) => {
    const waitAtLeast = Math.random() * min
    const addend = Math.random() * interval
    const ms = waitAtLeast + addend
    return new Promise(resolve => setTimeout(resolve, ms))
}

// ─── Handlers ─────────────────────────────────────────────────────────────────

export const handlers = root => [
    http.get(`${root}/api/schedule/:eventId`, async ({ params }) => {
        const schedule = SCHEDULES[params.eventId]
        if (!schedule) return new HttpResponse(null, { status: 404 })
        await timeout(1000)
        return HttpResponse.json(schedule)
    }),

    http.get(`${root}/api/sessions/:eventId`, async ({ params }) => {
        const sessions = SESSIONS[params.eventId]
        if (!sessions) return new HttpResponse(null, { status: 404 })
        await timeout(500)
        return HttpResponse.json(sessions)
    }),

    http.delete(`${root}/api/sessions/:eventId/:sessionId`, async ({ params }) => {
        const sessions = SESSIONS[params.eventId]
        if (!sessions) return new HttpResponse(null, { status: 404 })
        const idx = sessions.findIndex((s) => s.id === params.sessionId)
        if (idx < 0) return new HttpResponse(null, { status: 404 })
        sessions.splice(idx, 1)
        await timeout(200)
        return new HttpResponse(null, { status: 204 })
    }),
]
