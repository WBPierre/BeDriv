from typing import Dict

from src.common.core.model.custom_object_equals import CustomObjectEquals


class Location(CustomObjectEquals):

    def __init__(self,
                 latitude: float = None,
                 longitude: float = None,
                 description: str = None) -> None:
        self.latitude = latitude
        self.longitude = longitude
        self.description = description

    def __str__(self) -> str:
        return F'{self.latitude},{self.longitude}'

    def to_dict(self) -> Dict:
        result = dict(latitude=self.latitude,
                      longitude=self.longitude,
                      description=self.description)
        return result
