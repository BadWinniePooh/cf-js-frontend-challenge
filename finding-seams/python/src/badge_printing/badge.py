from dataclasses import dataclass
from datetime import datetime


@dataclass
class Badge:
    id: str
    name: str
    pronouns: str
    issued_at: datetime
