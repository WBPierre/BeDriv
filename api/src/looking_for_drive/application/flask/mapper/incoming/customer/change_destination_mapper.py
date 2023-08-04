from __future__ import annotations
from typing import Dict

from src.looking_for_drive.application.flask.error.incorrect_data_format_error import IncorrectDataFormatError
from src.looking_for_drive.application.flask.error.missing_data_error import MissingDataError
from src.looking_for_drive.core.model.drive.location import Location


class ChangeDestinationMapper:

    latitude_key = 'latitude'
    longitude_key = 'longitude'

    def __init__(self,
                 destination: Location):
        self.destination = destination

    @classmethod
    def validate_input(cls,
                       body: Dict):
        try:
            int(body[cls.latitude_key])
            int(body[cls.longitude_key])
        except KeyError as e:
            raise MissingDataError(str(e))
        except ValueError:
            raise IncorrectDataFormatError

    @classmethod
    def create_from_request(cls,
                            body: Dict) -> ChangeDestinationMapper:
        ChangeDestinationMapper.validate_input(body)
        change_destination_mapper = cls(Location(latitude=body[cls.latitude_key],
                                                 longitude=body[cls.longitude_key]))
        return change_destination_mapper
