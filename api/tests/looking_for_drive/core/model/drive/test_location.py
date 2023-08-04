import unittest

from src.looking_for_drive.core.model.drive.location import Location


class TestLocation(unittest.TestCase):

    def test_convert_str(self):
        location = Location(1, 1)
        self.assertEqual('1,1', str(location))