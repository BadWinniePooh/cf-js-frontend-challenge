package findingseams

import findingseams.badgeprinting.BadgePrinting
import org.junit.jupiter.api.Disabled
import org.junit.jupiter.api.Test
import kotlin.test.assertEquals

@Disabled("Exercise: finding seams — enable when working on badge printing")
class BadgePrinterTest {
    @Test
    fun `prints a badge`() {
        val badgeDispenser = BadgePrinting()

        val badge = badgeDispenser.createBadge("Test person", "they/them")

        assertEquals("CONF-1", badge.id)
        assertEquals("Test person", badge.name)
        assertEquals("they/them", badge.pronouns)
    }

    @Test
    fun `prints second badge`() {
        val badgeDispenser = BadgePrinting()

        val badge = badgeDispenser.createBadge("Test person", "they/them")

        assertEquals("CONF-2", badge.id)
        assertEquals("Test person", badge.name)
        assertEquals("they/them", badge.pronouns)
    }
}
