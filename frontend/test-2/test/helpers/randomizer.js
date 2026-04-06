const FIRST_NAMES = [
  'Alice', 'Bob', 'Carol', 'David', 'Emma',
  'Felix', 'Grace', 'Hugo', 'Iris', 'James',
  'Kira', 'Lena', 'Maria', 'Niko', 'Olivia',
  'Pekka', 'Quinn', 'Rosa', 'Sami', 'Tina',
]

const LAST_NAMES = [
  'Aalto', 'Brown', 'Davis', 'Evans', 'Ford',
  'Grant', 'Hall', 'Ikonen', 'Jones', 'Kent',
  'Korhonen', 'Lee', 'Mäkinen', 'Nguyen', 'Ojala',
  'Park', 'Rantanen', 'Smith', 'Virtanen', 'Ylinen',
]

const TAG_LABELS = [
  'Architecture', 'Backend', 'DevOps', 'Frontend',
  'Keynote', 'Lightning Talk', 'Open Space',
  'Security', 'Testing', 'Workshop',
]

const TAG_COLORS = ['blue', 'green', 'orange', 'purple', 'red']

const LOWER = 'abcdefghijklmnopqrstuvwxyz'
const UPPER = LOWER.toUpperCase()
const DIGITS = '0123456789'
const ALPHANUM = LOWER + UPPER + DIGITS

export const Randomizer = {
  /** Picks one element at random from `items`. */
  fromList(items) {
    return items[Math.floor(Math.random() * items.length)]
  },

  /** Returns a random integer in [min, max] (both inclusive). */
  integer(min = 0, max = 100) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  },

  /**
   * Builds a random string of exactly `length` characters drawn from `chars`.
   * Defaults to alphanumeric characters.
   */
  stringOf(length, chars = ALPHANUM) {
    return Array.from({ length }, () => this.fromList([...chars])).join('')
  },

  /** Generates a random "First Last" name. */
  name() {
    return `${this.fromList(FIRST_NAMES)} ${this.fromList(LAST_NAMES)}`
  },

  /**
   * Derives uppercase initials from a full name.
   * "Alice Kent" → "AK", "Maria R" → "MR"
   */
  initials(fullName) {
    return fullName
      .split(/\s+/)
      .filter(Boolean)
      .map(part => part[0].toUpperCase())
      .join('')
  },

  /** Picks a random valid tag color. */
  color() {
    return this.fromList(TAG_COLORS)
  },

  /** Builds a random `{ label, color }` tag object. */
  tag() {
    return { label: this.fromList(TAG_LABELS), color: this.color() }
  },

  /** Builds a random `{ name, initials }` attendee object. */
  attendee() {
    const fullName = this.name()
    return { name: fullName, initials: this.initials(fullName) }
  },

  /** Picks a random conference day. */
  day() {
    return this.fromList(['Wednesday', 'Thursday', 'Friday'])
  },

  /** Picks a random conference room. */
  room() {
    return this.fromList(['Main Hall', 'Track A', 'Track B', 'Workshop Room'])
  },
  uuid() {
    return crypto.randomUUID()
  }
}
