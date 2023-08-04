from __future__ import annotations
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from src.looking_for_drive.core.model.drive.drive import Drive


class Publisher:

    def publish_location(self,
                         drive: Drive,
                         drive_id: str):
        raise NotImplementedError
