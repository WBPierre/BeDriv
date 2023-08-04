from __future__ import annotations
from typing import Dict, Tuple, TYPE_CHECKING

from flask import request
from flask.views import MethodView

from src.looking_for_drive.application.flask.mapper.outgoing.customer.order_drive_dto import OrderDriveDTO
from src.common.application.flask.error.invalid_usage import InvalidUsage
from src.looking_for_drive.application.flask.error.incorrect_data_format_error import IncorrectDataFormatError
from src.looking_for_drive.application.flask.error.missing_data_error import MissingDataError
from src.looking_for_drive.application.flask.mapper.incoming.request_to_order_drive_information_mapper import \
    RequestToOrderDriveInformationMapper
from src.looking_for_drive.core.model.error.customer.order_drive.customer_has_drive_in_progress_error import \
    CustomerHasDriveInProgressError
from src.looking_for_drive.core.model.error.customer.order_drive.same_start_and_destination_error import \
    SameStartAndDestinationError
from src.looking_for_drive.core.use_case.customer.order_drive import OrderDrive
from src.looking_for_drive.infrastructure.firestore.error.customer_not_found_error import CustomerNotFoundError

if TYPE_CHECKING:
    from src.looking_for_drive.core.bridge.incoming.customers import Customers
    from src.looking_for_drive.core.bridge.incoming.drives import Drives
    from src.looking_for_drive.core.bridge.incoming.publisher import Publisher
    from src.looking_for_drive.core.bridge.incoming.payments import Payments


class OrderDriveRoute(MethodView):

    def __init__(self,
                 customers: Customers,
                 drives: Drives,
                 publisher: Publisher,
                 payments: Payments) -> None:
        self.order_drive = OrderDrive(customers,
                                      drives,
                                      publisher,
                                      payments)

    def post(self,
             customer_id: str) -> Tuple[Dict, int]:
        try:
            order_drive_information = RequestToOrderDriveInformationMapper \
                .create_order_drive_information_from_request(request.json)
        except MissingDataError as e:
            raise InvalidUsage(F"{str(e)} is missing from request body", status_code=400)
        except IncorrectDataFormatError:
            raise InvalidUsage("The provided data is incorrect", status_code=400)

        try:
            drive_id, drive_created, client_secret = self.order_drive.handle(order_drive_information.start,
                                                                             order_drive_information.destination,
                                                                             customer_id,
                                                                             order_drive_information.payment_info)
        except CustomerHasDriveInProgressError:
            raise InvalidUsage("The customer already has a drive in progress", status_code=423)
        except SameStartAndDestinationError:
            raise InvalidUsage("The start and destination is the same", status_code=400)
        except CustomerNotFoundError:
            raise InvalidUsage("Customer not found", status_code=404)

        return OrderDriveDTO.create_from_drive(drive_created, drive_id, client_secret).to_dict(), 201
