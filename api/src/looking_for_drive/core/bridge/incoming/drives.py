from __future__ import annotations
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from src.looking_for_drive.core.model.drive.drive import Drive


class Drives:

    def save(self,
             drive: Drive) -> str:
        raise NotImplementedError

    def find_by_id(self,
                   drive_id: str) -> Drive:
        raise NotImplementedError

    def update(self,
               drive: Drive) -> Drive:
        raise NotImplementedError

    def get_declined_drivers(self,
                             drive_id: str) -> list:
        raise NotImplementedError

    def update_declined_drivers(self,
                                drive_id: str,
                                driver_ids_list: list) -> None:
        raise NotImplementedError
