from typing import Tuple, Dict

from flask.views import MethodView

from src.common.application.flask.error.invalid_usage import InvalidUsage
from src.looking_for_drive.core.bridge.incoming.drives import Drives
from src.looking_for_drive.core.model.error.driver.driver_did_not_accept_drive_error import DriverDidNotAcceptDriveError
from src.looking_for_drive.core.model.error.driver.pick_up_customer.drive_is_not_accepted_error import \
    DriveIsNotAcceptedError
from src.looking_for_drive.core.use_case.driver.pick_up_customer import PickUpCustomer
from src.looking_for_drive.infrastructure.firestore.error.drive_not_found_error import DriveNotFoundError


class PickUpCustomerRoute(MethodView):

    def __init__(self,
                 drives: Drives):
        self.pick_up_customer = PickUpCustomer(drives)

    def put(self,
            driver_id: str,
            drive_id: str) -> Tuple[Dict, int]:
        try:
            drive = self.pick_up_customer.handle(drive_id=drive_id,
                                                 driver_id=driver_id)
        except DriveNotFoundError:
            raise InvalidUsage('Drive not found', status_code=404)
        except DriverDidNotAcceptDriveError:
            raise InvalidUsage('Driver did not accept drive', status_code=403)
        except DriveIsNotAcceptedError:
            raise InvalidUsage('Drive is not accepted', status_code=403)

        return dict(picked_up_time=drive.picked_up_time), 200
