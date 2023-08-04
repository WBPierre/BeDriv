from typing import Dict, Tuple


def distances_to_distance_duration_mapper(google_response: Dict) -> Tuple[int, int]:
    result = google_response['rows'][0]['elements'][0]
    distance = result['distance']['value']
    duration = result['duration_in_traffic']['value']
    return distance, duration
