import unittest

from src.looking_for_drive.application.flask.error.incorrect_data_format_error import IncorrectDataFormatError
from src.looking_for_drive.application.flask.mapper.incoming.request_to_start_and_destination_mapper import \
    RequestToStartAndDestinationMapper
from src.looking_for_drive.core.model.drive.location import Location


class TestRequestToStartAndDestinationMapper(unittest.TestCase):

    def test_input_has_correct_number_of_coordinate(self):
        user_input = '1,1'

        expected_output = ['1', '1']
        output = RequestToStartAndDestinationMapper.validate_input_and_split_input(user_input)

        self.assertEqual(expected_output, output)

    def test_input_has_incorrect_number_of_coordinate(self):
        user_input = '1'

        with self.assertRaises(IncorrectDataFormatError):
            RequestToStartAndDestinationMapper.validate_input_and_split_input(user_input)

    def test_input_is_converted_to_latitude_and_longitude(self):
        user_input = '1,1'

        expected_output = [1., 1.]
        output = RequestToStartAndDestinationMapper.get_latitude_longitude_from_input(user_input)

        self.assertEqual(expected_output, output)

    def test_input_is_converted_to_latitude_and_longitude_after_stripping(self):
        user_input = '1, 1'

        expected_output = [1., 1.]
        output = RequestToStartAndDestinationMapper.get_latitude_longitude_from_input(user_input)

        self.assertEqual(expected_output, output)

    def test_input_is_not_number(self):
        user_input = 'a, a'

        with self.assertRaises(IncorrectDataFormatError):
            RequestToStartAndDestinationMapper.get_latitude_longitude_from_input(user_input)

    def test_start_and_destination_are_converted(self):
        start_input = '1, 1'
        destination_input = '2, 2'

        expected_output = RequestToStartAndDestinationMapper(start=Location(1., 1.),
                                                             destination=Location(2., 2.))
        output = RequestToStartAndDestinationMapper.create_start_and_destination_from_request(start_input,
                                                                                              destination_input)

        self.assertEqual(expected_output, output)
