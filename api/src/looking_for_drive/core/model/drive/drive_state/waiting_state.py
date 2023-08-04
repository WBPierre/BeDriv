from __future__ import annotations
from typing import Tuple, TYPE_CHECKING

if TYPE_CHECKING:
    from src.looking_for_drive.core.model.drive.drive import Drive
    from src.looking_for_drive.core.model.driver.driver import Driver
from src.looking_for_drive.core.model.customer.cancellation_fee import CancellationFee
from src.looking_for_drive.core.model.drive.drive_state.drive_state import DriveState


class WaitingState(DriveState):

    name = 'waiting'

    def accept_drive(self,
                     drive: Drive,
                     state: DriveState) -> None:
        return drive.change_state(state)

    def customer_cancel_drive(self,
                              drive: Drive,
                              driver: Driver,
                              state: DriveState) -> Tuple[Driver, int]:
        drive.change_state(state)
        return driver, CancellationFee.NONE.value

    def change_destination(self) -> None:
        pass


waiting_state = WaitingState()
