from __future__ import annotations
from typing import TYPE_CHECKING

from src.looking_for_drive.core.bridge.incoming.publisher import Publisher

if TYPE_CHECKING:
    from src.looking_for_drive.core.model.drive.drive import Drive


class MockPublisher(Publisher):

    def __init__(self):
        self.topics = list()

    def publish_location(self,
                         drive: Drive,
                         drive_id: str):
        self.topics.append(drive)
