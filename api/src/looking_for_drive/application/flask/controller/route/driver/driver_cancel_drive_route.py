from typing import Dict, Tuple

from flask.views import MethodView

from src.common.application.flask.error.invalid_usage import InvalidUsage
from src.looking_for_drive.core.bridge.incoming.drivers import Drivers
from src.looking_for_drive.core.bridge.incoming.drives import Drives
from src.looking_for_drive.core.bridge.incoming.notifications import Notifications
from src.looking_for_drive.core.bridge.incoming.publisher import Publisher
from src.looking_for_drive.core.model.error.driver.cancel_drive.driver_cannot_cancel_drive_error import \
    DriverCannotCancelDriveError
from src.looking_for_drive.core.model.error.driver.driver_did_not_accept_drive_error import \
    DriverDidNotAcceptDriveError
from src.looking_for_drive.core.use_case.driver.cancel_drive import CancelDrive
from src.looking_for_drive.infrastructure.firestore.error.drive_not_found_error import DriveNotFoundError
from src.looking_for_drive.infrastructure.firestore.error.driver_not_found_error import DriverNotFoundError


class DriverCancelDriveRoute(MethodView):

    def __init__(self,
                 drives: Drives,
                 drivers: Drivers,
                 notifications: Notifications,
                 publisher: Publisher):
        self.cancel_drive = CancelDrive(drives,
                                        drivers,
                                        notifications,
                                        publisher)

    def put(self,
            driver_id: str,
            drive_id: str) -> Tuple[Dict, int]:
        try:
            self.cancel_drive.handle(driver_id,
                                     drive_id)
        except DriveNotFoundError:
            raise InvalidUsage('Drive not found', status_code=404)
        except DriverNotFoundError:
            raise InvalidUsage('Driver not found', status_code=404)
        except DriverDidNotAcceptDriveError:
            raise InvalidUsage('Driver did not accept drive', status_code=403)
        except DriverCannotCancelDriveError:
            raise InvalidUsage("Driver can't cancel drive", status_code=403)

        return dict(message='Drive cancelled'), 200
