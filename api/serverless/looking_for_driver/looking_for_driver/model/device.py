from __future__ import annotations
from typing import Tuple, Dict

from .geolocation import Geolocation


class Device:

    def __init__(self,
                 device_id: str,
                 geolocation: Geolocation,
                 start: Geolocation):
        self.__id = device_id
        self.geolocation = geolocation
        self._distance_from_start = geolocation.distance_to(start)

    @property
    def id(self) -> str:
        return self.__id

    @property
    def distance_from_start(self) -> float:
        return self._distance_from_start

    @distance_from_start.setter
    def distance_from_start(self, value: Geolocation) -> None:
        self._distance_from_start = self.geolocation.distance_to(value)

    @classmethod
    def create_from_tuple(cls,
                          device: Tuple[str, Dict],
                          start: Geolocation) -> Device:
        device = cls(device[1]['device_token'],
                     Geolocation.from_degrees(device[1]['latitude'],
                                              device[1]['longitude']),
                     start)
        return device

    def to_dict(self) -> Dict:
        device_dict = dict(id=self.__id,
                           geolocation=self.geolocation.to_dict(),
                           distance=self._distance_from_start)
        return device_dict
