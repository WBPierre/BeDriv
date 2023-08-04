import unittest

from src.looking_for_drive.infrastructure.google.distance_matrix.mapper.distances_to_distance_duration_mapper \
    import distances_to_distance_duration_mapper


class TestDistancesToDistanceDurationMapper(unittest.TestCase):

    def setUp(self) -> None:
        self.distance_test = 0
        self.duration_test = 1
        self.google_response = dict(rows=[
            dict(elements=[
                dict(distance=dict(value=self.distance_test),
                     duration_in_traffic=dict(value=self.duration_test))
            ])
        ])

    def test_map_response_to_distance_and_duration(self):
        distance, duration = distances_to_distance_duration_mapper(self.google_response)

        self.assertEqual(self.distance_test, distance)
        self.assertEqual(self.duration_test, duration)
