from typing import Dict

from src.looking_for_drive.core.model.driver.availability import Availability
from src.looking_for_drive.core.model.driver.driver import Driver


def driver_mapper(driver_id: str,
                  driver: Dict) -> Driver:
    available = Availability.AVAILABLE if driver['driver']['available'] else Availability.UNAVAILABLE
    driver = Driver(driver_id=driver_id,
                    name=driver['given_name'],
                    available=available,
                    device_token=driver['device_token'])
    return driver
