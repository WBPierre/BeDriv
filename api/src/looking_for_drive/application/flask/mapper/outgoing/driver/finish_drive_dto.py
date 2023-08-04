from __future__ import annotations
from typing import TYPE_CHECKING, Dict

if TYPE_CHECKING:
    from datetime import datetime

    from src.looking_for_drive.core.model.drive.drive import Drive


class FinishDriveDTO:

    def __init__(self,
                 end_time: datetime,
                 price: float):
        self.end_time = end_time
        self.price = price

    def to_dict(self) -> Dict:
        finish_drive_dto_dict = dict(end_time=self.end_time,
                                     price=self.price)
        return finish_drive_dto_dict

    @classmethod
    def create_from_drive(cls,
                          drive: Drive) -> FinishDriveDTO:
        finish_drive_dto = cls(end_time=drive.end_time,
                               price=drive.actual_price)
        return finish_drive_dto
