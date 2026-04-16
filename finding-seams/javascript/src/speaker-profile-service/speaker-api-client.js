// Naive API client that could talk to a real backend.
// Here it just simulates async calls.
export class SpeakerApiClient {
  async fetchSpeakerById(id) {
    // In a real system this would call HTTP. Here we just fake some data.
    return {
      id,
      name: `Speaker ${id}`,
      bio: `Bio for speaker ${id}`,
    }
  }

  async fetchTalksBySpeaker(id) {
    // Simulate some talks with mixed status.
    return [
      { id: `${id}-1`, title: 'Opening Keynote', cancelled: false, attendees: 250 },
      { id: `${id}-2`, title: 'Cancelled Talk', cancelled: true, attendees: 0 },
      { id: `${id}-3`, title: 'Popular Session', cancelled: false, attendees: 400 },
    ]
  }
}

