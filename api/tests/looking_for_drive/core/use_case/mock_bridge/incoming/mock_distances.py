from typing import Tuple

from src.looking_for_drive.core.bridge.incoming.distances import Distances
from src.looking_for_drive.core.model.drive.location import Location


class MockDistances(Distances):

    DISTANCE = 1000
    DURATION = 60

    def get_distance_and_duration(self,
                                  start: Location,
                                  destination: Location) -> Tuple[int, int]:
        return self.DISTANCE, self.DURATION
