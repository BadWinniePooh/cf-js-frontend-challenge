const SESSION_TYPE_CLASS = new Map([
  ['Talk', 'cfb-card__session-type--talk'],
  ['Workshop', 'cfb-card__session-type--workshop'],
  ['Keynote', 'cfb-card__session-type--keynote'],
  ['Lightning Talk', 'cfb-card__session-type--lightning-talk'],
])

export default function getSessionTypeClass(type) {
  return SESSION_TYPE_CLASS.get(type) ?? 'cfb-card__session-type--unknown'
}
