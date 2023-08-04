from __future__ import annotations
from typing import Dict, TYPE_CHECKING

if TYPE_CHECKING:
    from datetime import datetime

    from src.looking_for_drive.core.model.drive.drive import Drive


class CancelDriveDTO:

    def __init__(self,
                 cancelled_time: datetime,
                 price: float) -> None:
        self.cancelled_time = cancelled_time
        self.price = price

    def to_dict(self) -> Dict:
        cancel_drive_dto_dict = dict(cancelled_time=self.cancelled_time,
                                     price=self.price)
        return cancel_drive_dto_dict

    @classmethod
    def create_from_drive(cls,
                          drive: Drive):
        cancel_drive_dto = cls(cancelled_time=drive.cancelled_time,
                               price=drive.actual_price)
        return cancel_drive_dto
