from __future__ import annotations
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from src.looking_for_drive.core.bridge.incoming.drives import Drives
    from src.looking_for_drive.core.bridge.incoming.publisher import Publisher


class DeclineDrive:

    def __init__(self,
                 drives: Drives,
                 publisher: Publisher):
        self.drives = drives
        self.publisher = publisher

    def handle(self,
               driver_id: str,
               drive_id: str):
        drive = self.drives.find_by_id(drive_id)
        declined_drivers = self.drives.get_declined_drivers(drive_id)

        declined_drivers.append(driver_id)

        self.drives.update_declined_drivers(drive_id,
                                            declined_drivers)
        self.publisher.publish_location(drive,
                                        drive_id)
