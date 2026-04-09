export function parseSpeaker(raw) {
  const name = raw.trim();
  if (!name) return [];
  const initials = name
    .split(/\s+/)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
  return [{ initials, name }];
}

export function parseSpeakers(raw) {
    return raw.split(", ").map(s => parseSpeaker(s)).flat();
}

export function speakersToString(speakers) {
    return speakers.map(s => s.name).join(", ");
}