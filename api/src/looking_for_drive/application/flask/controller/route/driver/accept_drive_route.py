from typing import Tuple, Dict

from flask.views import MethodView

from src.common.application.flask.error.invalid_usage import InvalidUsage
from src.looking_for_drive.application.flask.mapper.outgoing.driver.accept_drive_dto import AcceptDriveDTO
from src.looking_for_drive.core.bridge.incoming.drivers import Drivers
from src.looking_for_drive.core.bridge.incoming.drives import Drives
from src.looking_for_drive.core.bridge.incoming.notifications import Notifications
from src.looking_for_drive.core.model.error.driver.accept_drive.drive_is_not_in_waiting_state_error import \
    DriveIsNotInWaitingStateError
from src.looking_for_drive.core.model.error.driver.accept_drive.driver_is_unavailable_error import \
    DriverIsUnavailableError
from src.looking_for_drive.core.use_case.driver.accept_drive import AcceptDrive
from src.looking_for_drive.infrastructure.firestore.error.drive_not_found_error import DriveNotFoundError
from src.looking_for_drive.infrastructure.firestore.error.driver_not_found_error import DriverNotFoundError


class AcceptDriveRoute(MethodView):

    def __init__(self,
                 drives: Drives,
                 drivers: Drivers,
                 notifications: Notifications) -> None:
        self.accept_drive = AcceptDrive(drives,
                                        drivers,
                                        notifications)

    def put(self,
            drive_id: str,
            driver_id: str) -> Tuple[Dict, int]:
        try:
            drive = self.accept_drive.handle(drive_id,
                                             driver_id)
        except DriveNotFoundError:
            raise InvalidUsage("Drive not found", status_code=404)
        except DriverNotFoundError:
            raise InvalidUsage("Driver not found", status_code=404)
        except DriveIsNotInWaitingStateError:
            raise InvalidUsage("Driver already found", status_code=409)
        except DriverIsUnavailableError:
            raise InvalidUsage("Driver is unavailable", status_code=423)
        return AcceptDriveDTO.create_from_drive(drive).to_dict(), 200
