from __future__ import annotations
from typing import TYPE_CHECKING

from flask.views import MethodView

from src.common.application.flask.error.invalid_usage import InvalidUsage
from src.looking_for_drive.core.use_case.driver.decline_drive import DeclineDrive
from src.looking_for_drive.infrastructure.firestore.error.drive_not_found_error import DriveNotFoundError

if TYPE_CHECKING:
    from src.looking_for_drive.core.bridge.incoming.drives import Drives
    from src.looking_for_drive.core.bridge.incoming.publisher import Publisher


class DeclineDriveRoute(MethodView):

    def __init__(self,
                 drives: Drives,
                 publisher: Publisher):
        self.decline_drive = DeclineDrive(drives,
                                          publisher)

    def put(self,
            driver_id: str,
            drive_id: str):
        try:
            self.decline_drive.handle(driver_id,
                                      drive_id)
        except DriveNotFoundError:
            raise InvalidUsage('Drive not found',
                               status_code=404)
        return dict(message='Drive declined'), 200
