from __future__ import annotations
from typing import TYPE_CHECKING, Dict

if TYPE_CHECKING:
    from src.looking_for_drive.core.model.drive.location import Location
    from src.looking_for_drive.core.model.drive.drive import Drive


class PublisherDriveDTO:

    def __init__(self,
                 drive_id: str = None,
                 customer_id: str = None,
                 customer_name: str = None,
                 start: Location = None,
                 destination: Location = None,
                 estimated_price: int = None):
        self.__drive_id = drive_id
        self.__customer_id = customer_id
        self.customer_name = customer_name
        self.start = start
        self.destination = destination
        self.estimated_price = estimated_price

    @property
    def drive_id(self):
        return self.__drive_id

    @property
    def customer_id(self):
        return self.__customer_id

    @classmethod
    def create_from_drive(cls,
                          drive: Drive,
                          drive_id: str) -> PublisherDriveDTO:
        publisher_drive_dto = cls(drive_id=drive_id,
                                  customer_id=drive.customer.id,
                                  customer_name=drive.customer.name,
                                  start=drive.start_location,
                                  destination=drive.destination,
                                  estimated_price=drive.price_estimate)
        return publisher_drive_dto

    def to_dict(self) -> Dict:
        publisher_driver_dto_dict = dict(drive_id=self.__drive_id,
                                         customer_id=self.__customer_id,
                                         customer_name=self.customer_name,
                                         start=self.start.to_dict(),
                                         destination=self.destination.to_dict(),
                                         estimated_price=self.estimated_price)
        return publisher_driver_dto_dict
