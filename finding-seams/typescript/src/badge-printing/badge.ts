export class Badge {
  id: string
  name: string
  pronouns: string
  issuedAt: Date

  constructor(id: string, name: string, pronouns: string, issuedAt: Date) {
    this.id = id
    this.name = name
    this.pronouns = pronouns
    this.issuedAt = issuedAt
  }
}
