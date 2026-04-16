from __future__ import annotations

from datetime import datetime
from typing import Any

from badge_printing.badge import Badge
from badge_printing.badge_id_generation import badge_sequence


class BadgePrinting:
    """
    Legacy-style dispenser tightly coupled to the global sequence.
    """

    def __init__(
        self,
        printer_drivers: Any = None,
        printer_configs: Any = None,
        badge_dimension_resolvers: Any = None,
        printer_factory: Any = None,
    ) -> None:
        self._printer_drivers = printer_drivers
        self._printer_configs = printer_configs
        self._badge_dimension_resolvers = badge_dimension_resolvers
        self._printer_factory = printer_factory

    def create_badge(self, name: str, pronouns: str) -> Badge:
        issued_at = datetime.now()
        next_num = badge_sequence.next_id()
        formatted_id = f"CONF-{next_num}"
        return Badge(id=formatted_id, name=name, pronouns=pronouns, issued_at=issued_at)

    def print_badge(self, badge: Badge) -> None:
        """
        This is a very clumsy method, only to add numerous arguments for constructor, to show that constructor
        injection in this case might not be the best possible option - and should not be used for this exercise.
        """
        dimensions = self._badge_dimension_resolvers.resolve(badge)
        config = self._printer_configs.get_config_based_on_dimensions(dimensions)
        driver = self._printer_drivers.get("BadgePrinting")
        printer = self._printer_factory.load(driver, config)
        printer.print(badge)
