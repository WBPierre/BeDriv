from __future__ import annotations
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from src.looking_for_drive.core.model.drive.drive import Drive
from src.looking_for_drive.core.model.drive.drive_state.drive_state import DriveState


class PickedUpState(DriveState):

    name = 'picked_up'

    def finish_drive(self,
                     drive: Drive,
                     state: DriveState) -> None:
        drive.change_state(state)

    def change_destination(self) -> None:
        pass


picked_up_state = PickedUpState()
