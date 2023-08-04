from typing import Tuple

from src.looking_for_drive.core.model.drive.location import Location


class Distances:

    def get_distance_and_duration(self,
                                  start: Location,
                                  destination: Location) -> Tuple[int, int]:
        raise NotImplementedError
