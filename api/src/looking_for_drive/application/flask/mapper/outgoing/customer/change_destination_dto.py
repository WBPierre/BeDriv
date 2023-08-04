from __future__ import annotations
from typing import TYPE_CHECKING, Dict

if TYPE_CHECKING:
    from src.looking_for_drive.core.model.drive.drive import Drive


class ChangeDestinationDTO:

    def __init__(self,
                 duration: int,
                 estimated_price: float):
        self.duration = duration
        self.estimated_price = estimated_price

    def to_dict(self) -> Dict:
        change_destination_dict = dict(duration=self.duration,
                                       estimated_price=self.estimated_price)
        return change_destination_dict

    @classmethod
    def create_from_drive(cls,
                          drive: Drive,
                          duration: int) -> ChangeDestinationDTO:
        change_destination_dto = cls(duration,
                                     drive.price_estimate)
        return change_destination_dto
