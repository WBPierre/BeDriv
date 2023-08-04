from typing import Tuple
import requests

from src.config.google.google_maps import google_maps_cfg
from src.looking_for_drive.core.bridge.incoming.distances import Distances
from src.looking_for_drive.core.model.drive.location import Location
from src.looking_for_drive.infrastructure.google.distance_matrix.error.distance_matrix_error import DistanceMatrixError
from src.looking_for_drive.infrastructure.google.distance_matrix.mapper.distances_to_distance_duration_mapper import \
    distances_to_distance_duration_mapper


class GoogleDistances(Distances):

    def get_distance_and_duration(self,
                                  start: Location,
                                  destination: Location) -> Tuple[int, int]:
        google_distance_matrix_response = requests.get(F'{google_maps_cfg["url"]}/'
                                                       F'{google_maps_cfg["distance_matrix"]}?'
                                                       F'origins={start}&'
                                                       F'destinations={destination}&'
                                                       F'departure_time=now&'
                                                       F'key={google_maps_cfg["key"]}')
        google_distance_matrix_output = google_distance_matrix_response.json()
        if google_distance_matrix_output['status'] != 'OK':
            raise DistanceMatrixError(google_distance_matrix_output["error_message"],
                                      status_code=google_distance_matrix_output.status_code)
        return distances_to_distance_duration_mapper(google_distance_matrix_output)


if __name__ == '__main__':
    o = GoogleDistances()
    a = Location(48.83757060263987, 2.484437596374329)
    b = Location(48.84934972015407, 2.389444521513937)
    print(o.get_distance_and_duration(a, b))
