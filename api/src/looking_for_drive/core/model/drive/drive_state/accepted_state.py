from __future__ import annotations
from typing import Tuple, TYPE_CHECKING

from src.looking_for_drive.core.model.driver.availability import Availability

if TYPE_CHECKING:
    from src.looking_for_drive.core.model.drive.drive import Drive
from src.looking_for_drive.core.model.driver.driver import Driver
from src.looking_for_drive.core.model.drive.drive_state.drive_state import DriveState
from src.looking_for_drive.core.model.customer.cancellation_fee import CancellationFee


class AcceptedState(DriveState):

    name = 'accepted'

    def customer_cancel_drive(self,
                              drive: Drive,
                              driver: Driver,
                              state: DriveState) -> Tuple[Driver, int]:
        drive.change_state(state)
        driver = Driver.toggle_availability(driver,
                                            Availability.AVAILABLE)
        return driver, CancellationFee.DRIVER_FOUND.value

    def driver_cancel_drive(self,
                            drive: Drive,
                            state: DriveState) -> None:
        drive.change_state(state)

    def pick_up_customer(self,
                         drive: Drive,
                         state: DriveState) -> None:
        drive.change_state(state)

    def change_destination(self) -> None:
        pass


accepted_state = AcceptedState()
