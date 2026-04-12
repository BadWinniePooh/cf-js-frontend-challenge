package findingseams.badgeprinting

import java.time.Instant

class BadgePrinting(
    private val printerDrivers: PrinterDrivers? = null,
    private val printerConfigs: PrinterConfigs? = null,
    private val badgeDimensionResolvers: BadgeDimensionResolvers? = null,
    private val printerFactory: PrinterFactory? = null,
) {
    fun createBadge(name: String, pronouns: String): Badge {
        val issuedAt = Instant.now()
        val id = BadgeSequence.nextId()
        val formattedId = "CONF-$id"
        return Badge(formattedId, name, pronouns, issuedAt)
    }

    @Suppress("UNUSED_PARAMETER", "UNCHECKED_CAST")
    fun printBadge(badge: Badge) {
        val resolvers = badgeDimensionResolvers as BadgeDimensionResolvers
        val configs = printerConfigs as PrinterConfigs
        val drivers = printerDrivers as PrinterDrivers
        val factory = printerFactory as PrinterFactory
        val dimensions = resolvers.resolve(badge)
        val config = configs.getConfigBasedOnDimensions(dimensions)
        val driver = drivers.get("BadgePrinting")
        val printer = factory.load(driver, config)
        printer.print(badge)
    }
}

interface BadgeDimensionResolvers {
    fun resolve(badge: Badge): Any
}

interface PrinterConfigs {
    fun getConfigBasedOnDimensions(dimensions: Any): Any
}

interface PrinterDrivers {
    fun get(name: String): Any
}

interface PrinterFactory {
    fun load(driver: Any, config: Any): Printer
}

interface Printer {
    fun print(badge: Badge)
}
