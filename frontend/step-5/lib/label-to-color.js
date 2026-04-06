export const KNOWN_TAGS = [
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

export const labelToColor = label => {
  const match = KNOWN_TAGS.find(t => t.label.toLowerCase() === label.toLowerCase())
  return match?.color ?? 'blue'
}

export const isKnownTag = label =>
  KNOWN_TAGS.some(t => t.label.toLowerCase() === label.toLowerCase())