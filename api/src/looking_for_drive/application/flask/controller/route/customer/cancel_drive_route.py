from typing import Tuple, Dict

from flask.views import MethodView

from src.common.application.flask.error.invalid_usage import InvalidUsage
from src.looking_for_drive.application.flask.mapper.outgoing.customer.cancel_drive_dto import CancelDriveDTO
from src.looking_for_drive.core.bridge.incoming.customers import Customers
from src.looking_for_drive.core.bridge.incoming.drivers import Drivers
from src.looking_for_drive.core.bridge.incoming.drives import Drives
from src.looking_for_drive.core.bridge.incoming.notifications import Notifications
from src.looking_for_drive.core.model.error.customer.cancel_drive.customer_cannot_cancel_drive_error import \
    CustomerCannotCancelDriveError
from src.looking_for_drive.core.model.error.customer.customer_did_not_order_drive_error import \
    CustomerDidNotOrderDriveError
from src.looking_for_drive.core.use_case.customer.cancel_drive import CancelDrive
from src.looking_for_drive.infrastructure.firestore.error.customer_not_found_error import CustomerNotFoundError
from src.looking_for_drive.infrastructure.firestore.error.drive_not_found_error import DriveNotFoundError


class CancelDriveRoute(MethodView):

    def __init__(self,
                 drives: Drives,
                 customers: Customers,
                 drivers: Drivers,
                 notifications: Notifications):
        self.cancel_drive = CancelDrive(drives,
                                        customers,
                                        drivers,
                                        notifications)

    def put(self,
            customer_id: str,
            drive_id: str) -> Tuple[Dict, int]:
        try:
            drive = self.cancel_drive.handle(customer_id,
                                             drive_id)
        except CustomerNotFoundError:
            raise InvalidUsage("Customer not found", status_code=404)
        except DriveNotFoundError:
            raise InvalidUsage("Drive not found", status_code=404)
        except CustomerDidNotOrderDriveError:
            raise InvalidUsage("Customer did not order drive", status_code=403)
        except CustomerCannotCancelDriveError:
            raise InvalidUsage("Customer can't cancel drive", status_code=403)

        return CancelDriveDTO.create_from_drive(drive).to_dict(), 200

