import { SpeakerApiClient } from './speaker-api-client.js'

// Legacy-style service that constructs its own API client internally.
export class SpeakerProfileService {
  async buildProfile(speakerId) {
    const client = new SpeakerApiClient()

    const [speaker, talks] = await Promise.all([
      client.fetchSpeakerById(speakerId),
      client.fetchTalksBySpeaker(speakerId),
    ])

    const activeTalks = talks.filter(talk => !talk.cancelled)

    // Pick the first talk as "primary", arbitrarily.
    const primaryTalk = activeTalks[0] || null

    // Popularity is a naive sum of attendees.
    const popularity = activeTalks.reduce(
      (acc, talk) => acc + (typeof talk.attendees === 'number' ? talk.attendees : 0),
      0,
    )

    return {
      id: speaker.id,
      name: speaker.name,
      bio: speaker.bio,
      primaryTalk,
      talks: activeTalks,
      popularity,
    }
  }
}

