from __future__ import annotations
import copy
from typing import Dict

from src.common.core.model.custom_object_equals import CustomObjectEquals
from src.looking_for_drive.core.model.driver.availability import Availability
from src.looking_for_drive.core.model.error.driver.accept_drive.driver_is_unavailable_error import DriverIsUnavailableError
from src.looking_for_drive.core.model.error.driver.driver_did_not_accept_drive_error import \
    DriverDidNotAcceptDriveError


class Driver(CustomObjectEquals):

    def __init__(self,
                 driver_id: str = None,
                 name: str = None,
                 available: Availability = None,
                 device_token: str = None) -> None:
        self.__id = driver_id
        self.name = name
        self.available = available
        self.device_token = device_token

    @property
    def id(self) -> str:
        return self.__id

    def to_dict(self) -> Dict:
        driver_dict = dict(given_name=self.name,
                           available=True if self.available == Availability.AVAILABLE else False,
                           device_token=self.device_token)
        return driver_dict

    def is_available(self) -> None:
        if self.available == Availability.UNAVAILABLE:
            raise DriverIsUnavailableError

    def is_the_same(self, driver_id: str) -> None:
        if self.__id != driver_id:
            raise DriverDidNotAcceptDriveError

    @classmethod
    def toggle_availability(cls,
                            driver: Driver,
                            available: Availability) -> Driver:
        driver = cls(driver_id=driver.id,
                     name=driver.name,
                     available=available,
                     device_token=driver.device_token)
        return driver
