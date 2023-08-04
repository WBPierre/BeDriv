from __future__ import annotations
from typing import TYPE_CHECKING, Tuple

if TYPE_CHECKING:
    from src.looking_for_drive.core.bridge.incoming.drives import Drives
    from src.looking_for_drive.core.bridge.incoming.distances import Distances
    from src.looking_for_drive.core.model.drive.location import Location
    from src.looking_for_drive.core.model.drive.drive import Drive


class ChangeDestination:

    def __init__(self,
                 drives: Drives,
                 distances: Distances):
        self.drives = drives
        self.distances = distances

    def handle(self,
               drive_id: str,
               customer_id: str,
               destination: Location) -> Tuple[int, Drive]:
        drive = self.drives.find_by_id(drive_id)
        distance, duration = self.distances.get_distance_and_duration(drive.start_location,
                                                                      destination)

        drive.change_destination(customer_id,
                                 destination,
                                 distance,
                                 duration)

        self.drives.update(drive)
        return duration, drive
