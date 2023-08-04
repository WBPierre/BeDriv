from __future__ import annotations
from typing import Dict, TYPE_CHECKING

if TYPE_CHECKING:
    from src.looking_for_drive.core.model.drive.drive import Drive
    from src.looking_for_drive.core.model.drive.location import Location


class AcceptDriveDTO:

    def __init__(self,
                 start_location: Location,
                 destination: Location) -> None:
        self.start_location = start_location
        self.destination = destination

    def to_dict(self) -> Dict:
        accept_drive_dto_dict = dict(start_location=self.start_location.to_dict(),
                                     destination=self.destination.to_dict())
        return accept_drive_dto_dict

    @classmethod
    def create_from_drive(cls,
                          drive: Drive) -> AcceptDriveDTO:
        accept_drive_dto = cls(start_location=drive.start_location,
                               destination=drive.destination)
        return accept_drive_dto
