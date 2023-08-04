from __future__ import annotations
from typing import Dict, TYPE_CHECKING, Tuple

from flask.views import MethodView

if TYPE_CHECKING:
    from src.looking_for_drive.core.bridge.incoming.distances import Distances
    from src.looking_for_drive.core.bridge.incoming.drivers import Drivers
    from src.looking_for_drive.core.bridge.incoming.drives import Drives
    from src.looking_for_drive.core.bridge.incoming.customers import Customers
    from src.looking_for_drive.core.bridge.incoming.payments import Payments
    from src.looking_for_drive.core.bridge.incoming.notifications import Notifications
    from src.looking_for_drive.core.bridge.incoming.blockchain import BlockChain

from src.common.application.flask.error.invalid_usage import InvalidUsage
from src.looking_for_drive.application.flask.mapper.outgoing.driver.finish_drive_dto import FinishDriveDTO
from src.looking_for_drive.core.model.error.driver.driver_did_not_accept_drive_error import DriverDidNotAcceptDriveError
from src.looking_for_drive.core.model.error.driver.finish_drive.customer_is_not_picked_up_error import \
    CustomerIsNotPickedUpError
from src.looking_for_drive.core.use_case.driver.finish_drive import FinishDrive
from src.looking_for_drive.infrastructure.firestore.error.drive_not_found_error import DriveNotFoundError
from src.looking_for_drive.infrastructure.google.distance_matrix.error.distance_matrix_error import DistanceMatrixError


class FinishDriveRoute(MethodView):

    def __init__(self,
                 drives: Drives,
                 drivers: Drivers,
                 distances: Distances,
                 customers: Customers,
                 notifications: Notifications,
                 payments: Payments,
                 blockchain: BlockChain):
        self.finish_drive = FinishDrive(drives,
                                        drivers,
                                        distances,
                                        customers,
                                        notifications,
                                        payments,
                                        blockchain)

    def put(self,
            drive_id: str,
            driver_id: str) -> Tuple[Dict, int]:
        try:
            drive = self.finish_drive.handle(drive_id,
                                             driver_id)
        except DriveNotFoundError:
            raise InvalidUsage('Drive not found', status_code=404)
        except DistanceMatrixError as e:
            raise InvalidUsage(e.message, status_code=e.status_code)
        except DriverDidNotAcceptDriveError:
            raise InvalidUsage('Driver did not accept drive', status_code=403)
        except CustomerIsNotPickedUpError:
            raise InvalidUsage('Customer is not picked up', status_code=403)

        return FinishDriveDTO.create_from_drive(drive).to_dict(), 200
