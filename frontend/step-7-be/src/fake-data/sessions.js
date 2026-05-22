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


export const sessions = {
  'codefreeze-2025': [
    {
      id: 'cf25-1',
      eventId: 'codefreeze-2025',
      title: 'Opening Keynote!',
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
      title: 'Web Components Deep Dive',
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
      title: 'TDD in the Browser',
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
      title: 'IndexedDB Patterns',
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
      title: 'Closing Panel',
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
      title: 'State of the Web Platform!',
      day: 'Tuesday',
      room: 'Auditorium',
      tags: [{ label: 'Keynote', color: 'blue' }],
      attendees: [pick(INITIALS_AND_NAMES), pick(INITIALS_AND_NAMES), pick(INITIALS_AND_NAMES), pick(INITIALS_AND_NAMES)].filter(
        (v, i, a) => a.indexOf(v) === i   // deduplicate
      ),
    },
    {
      id: 'dd25-2',
      eventId: 'devdays-2025',
      title: 'Accessibility by Default',
      day: 'Tuesday',
      room: 'Track 1',
      tags: [
        { label: 'A11y', color: 'green' },
        { label: 'Talk', color: 'orange' }
      ],
      attendees: [pick(INITIALS_AND_NAMES), pick(INITIALS_AND_NAMES), pick(INITIALS_AND_NAMES), pick(INITIALS_AND_NAMES)].filter(
        (v, i, a) => a.indexOf(v) === i   // deduplicate
      ),
    }
  ]
}
