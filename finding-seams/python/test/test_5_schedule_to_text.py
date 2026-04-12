from datetime import datetime, timezone

import pytest

from schedule_visualising.schedule_to_text import ScheduleToText


@pytest.mark.skip(reason="Exercise: finding seams — enable when working on schedule to text")
@pytest.mark.asyncio
async def test_prints_as_markdown() -> None:
    schedule_converter = ScheduleToText()

    day = datetime(2025, 11, 3, tzinfo=timezone.utc)
    ts_ms = int(day.timestamp() * 1000)

    result = await schedule_converter.convert_to_text(ts_ms, {"includeBreaks": False})

    assert result == (
        "# Conference Schedule – Day 1 (UTC)\n\n"
        "* 09:00–10:00 Example Keynote – (Unknown Speaker) @ Main Hall [talk]\n"
        "* 10:00–11:30 Example workshop – (Unknown Speaker) @ TBD room [workshop]\n"
    )
