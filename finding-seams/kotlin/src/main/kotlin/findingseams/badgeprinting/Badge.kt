package findingseams.badgeprinting

import java.time.Instant

data class Badge(
    val id: String,
    val name: String,
    val pronouns: String,
    val issuedAt: Instant,
)
