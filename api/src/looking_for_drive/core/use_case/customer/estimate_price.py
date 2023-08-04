from src.looking_for_drive.core.bridge.incoming.distances import Distances
from src.looking_for_drive.core.model.drive.location import Location
from src.looking_for_drive.core.model.drive.pricing import Pricing


class EstimatePrice:

    def __init__(self,
                 distances: Distances) -> None:
        self.distances = distances

    def handle(self,
               start: Location,
               destination: Location) -> Pricing:
        distance, duration = self.distances.get_distance_and_duration(start, destination)
        pricing = Pricing.calculate_price(distance,
                                          duration)
        return pricing
