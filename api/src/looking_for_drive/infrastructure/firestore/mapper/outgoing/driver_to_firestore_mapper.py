from __future__ import annotations
from typing import TYPE_CHECKING, Dict

from src.looking_for_drive.core.model.driver.availability import Availability

if TYPE_CHECKING:
    from src.looking_for_drive.core.model.driver.driver import Driver


class DriverToFirestoreMapper:

    @staticmethod
    def map_for_firestore(driver: Driver) -> Dict:
        firestore_driver = dict(given_name=driver.name,
                                driver=dict(available=True if driver.available == Availability.AVAILABLE else False),
                                device_token=driver.device_token)
        return firestore_driver
