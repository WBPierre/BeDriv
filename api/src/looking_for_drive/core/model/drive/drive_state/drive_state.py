from __future__ import annotations
from typing import Any, Tuple, TYPE_CHECKING

from src.looking_for_drive.core.model.error.customer.change_destination.destination_cannot_be_changed_error import \
    DestinationCannotBeChangedError
from src.looking_for_drive.core.model.error.driver.finish_drive.customer_is_not_picked_up_error import \
    CustomerIsNotPickedUpError
from src.looking_for_drive.core.model.error.driver.pick_up_customer.drive_is_not_accepted_error import \
    DriveIsNotAcceptedError

if TYPE_CHECKING:
    from src.looking_for_drive.core.model.drive.drive import Drive
    from src.looking_for_drive.core.model.driver.driver import Driver
from src.looking_for_drive.core.model.error.customer.cancel_drive.customer_cannot_cancel_drive_error import \
    CustomerCannotCancelDriveError
from src.looking_for_drive.core.model.error.driver.accept_drive.drive_is_not_in_waiting_state_error \
    import DriveIsNotInWaitingStateError
from src.looking_for_drive.core.model.error.driver.cancel_drive.driver_cannot_cancel_drive_error import \
    DriverCannotCancelDriveError


class DriveState:

    name = None

    def __eq__(self, other) -> bool:
        return self.name == other.name

    def accept_drive(self,
                     drive: Drive,
                     state: DriveState) -> None:
        raise DriveIsNotInWaitingStateError

    def customer_cancel_drive(self,
                              drive: Drive,
                              driver: Driver,
                              state: DriveState) -> Tuple[Driver, int]:
        raise CustomerCannotCancelDriveError

    def driver_cancel_drive(self,
                            drive: Drive,
                            state: DriveState) -> None:
        raise DriverCannotCancelDriveError

    def pick_up_customer(self,
                         drive: Drive,
                         state: DriveState) -> None:
        raise DriveIsNotAcceptedError

    def finish_drive(self,
                     drive: Drive,
                     state: DriveState) -> None:
        raise CustomerIsNotPickedUpError

    def change_destination(self) -> None:
        raise DestinationCannotBeChangedError
