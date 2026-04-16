import { readFile } from 'node:fs/promises'
import type { ScheduleSession } from './schedule-formatter.js'
import { ScheduleFormatter } from './schedule-formatter.js'

const CONFERENCE_START = new Date('2025-11-03T00:00:00Z')
const CONFERENCE_DURATION_DAYS = 3

const TIMEZONE_OFFSETS: Record<string, number> = {
  'UTC': 0,
  'Europe/Helsinki': 120,
  'Europe/Stockholm': 60,
  'Europe/London': 0,
  'America/New_York': -300,
  'America/Chicago': -360,
  'America/Los_Angeles': -480,
}

const SUPPORTED_LOCALES = ['en-US', 'en-GB', 'fi-FI', 'sv-SE', 'de-DE'] as const

function daysBetween(a: Date, b: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24
  return Math.floor((b.getTime() - a.getTime()) / msPerDay)
}

function toDateString(date: Date): string {
  const y = date.getUTCFullYear()
  const m = String(date.getUTCMonth() + 1).padStart(2, '0')
  const d = String(date.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export type ConvertToTextOptions = {
  timezone?: string
  locale?: string
  track?: string
  includeBreaks?: boolean
  types?: string[]
}

type ScheduleJson = {
  sessions: ScheduleSession[]
}

// Legacy-style converter that mixes date logic, filtering, and formatting.
export class ScheduleToText {
  #formatter: ScheduleFormatter
  #scheduleDir: URL

  constructor() {
    this.#formatter = new ScheduleFormatter()
    this.#scheduleDir = new URL('./', import.meta.url)
  }

  async convertToText(date: Date | number | string, options: ConvertToTextOptions = {}): Promise<string> {
    /**
     * All this is seemingly important code.
     * It is here only to make the code longer - you don't need to spend any time understanding
     * what this does. It's there only to make the function longer
     **/
    const requestedDate = date instanceof Date ? date : new Date(date)
    if (isNaN(requestedDate.getTime())) {
      return 'Invalid date provided.\n'
    }

    const dayIndex = daysBetween(CONFERENCE_START, requestedDate)
    if (dayIndex < 0 || dayIndex >= CONFERENCE_DURATION_DAYS) {
      return `No schedule available for ${requestedDate.toDateString()}.\n`
    }
    const conferenceDay = dayIndex + 1
    const dateString = toDateString(requestedDate)

    const timezone = options.timezone ?? 'UTC'
    const timezoneOffset = TIMEZONE_OFFSETS[timezone] ?? 0
    const locale = options.locale !== undefined && SUPPORTED_LOCALES.includes(options.locale as (typeof SUPPORTED_LOCALES)[number])
      ? options.locale
      : 'en-US'
    const track = options.track ?? 'all'
    const includeBreaks = options.includeBreaks !== false
    const allowedTypes = options.types ?? ['talk', 'workshop', 'break']

    /**
     * That's end of the 'not-so-important code'
     *
     **/

    const filePath = new URL(`schedule-${dateString}.json`, this.#scheduleDir)
    const raw = await readFile(filePath, 'utf8')
    const scheduleData = JSON.parse(raw) as ScheduleJson

    /**
     * Code for controlling the output
     **/

    let sessions = scheduleData.sessions
    if (track !== 'all') {
      sessions = sessions.filter(s => s.track === track || s.track === 'all')
    }
    if (!includeBreaks) {
      sessions = sessions.filter(s => s.type !== 'break')
    }
    sessions = sessions.filter(s => typeof s.type === 'string' && allowedTypes.includes(s.type))

    const formattingOptions = { locale, timezoneOffset, conferenceDay, timezone }

    /**
     * And here print it.
     **/
    return this.#formatter.format({ sessions }, formattingOptions)
  }
}
