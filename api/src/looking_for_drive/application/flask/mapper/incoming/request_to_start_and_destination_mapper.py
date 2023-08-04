from typing import List, Any

from src.common.core.model.custom_object_equals import CustomObjectEquals
from src.looking_for_drive.application.flask.error.incorrect_data_format_error import IncorrectDataFormatError
from src.looking_for_drive.core.model.drive.location import Location


class RequestToStartAndDestinationMapper(CustomObjectEquals):

    def __init__(self,
                 start: Location = None,
                 destination: Location = None) -> None:
        self.start = start
        self.destination = destination

    @staticmethod
    def validate_input_and_split_input(user_input: str) -> List:
        split_user_input = user_input.split(',')
        if len(split_user_input) != 2:
            raise IncorrectDataFormatError
        return split_user_input

    @staticmethod
    def get_latitude_longitude_from_input(start_or_destination_input: str) -> List:
        split_input = RequestToStartAndDestinationMapper.validate_input_and_split_input(start_or_destination_input)
        try:
            latitude_and_longitude = list(map(lambda e: float(e.strip()), split_input))
        except ValueError:
            raise IncorrectDataFormatError
        return latitude_and_longitude

    @classmethod
    def create_start_and_destination_from_request(cls,
                                                  start: str,
                                                  destination: str) -> Any:
        start_latitude, start_longitude = RequestToStartAndDestinationMapper.get_latitude_longitude_from_input(start)
        destination_latitude, destination_longitude = RequestToStartAndDestinationMapper.\
            get_latitude_longitude_from_input(destination)
        start_location = Location(latitude=start_latitude,
                                  longitude=start_longitude)
        destination_location = Location(latitude=destination_latitude,
                                        longitude=destination_longitude)
        return cls(start=start_location, destination=destination_location)
