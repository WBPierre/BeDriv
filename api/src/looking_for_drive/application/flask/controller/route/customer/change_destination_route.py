from __future__ import annotations
from typing import TYPE_CHECKING, Tuple, Dict

from flask import request
from flask.views import MethodView

from src.common.application.flask.error.invalid_usage import InvalidUsage
from src.looking_for_drive.application.flask.error.incorrect_data_format_error import IncorrectDataFormatError
from src.looking_for_drive.application.flask.error.missing_data_error import MissingDataError
from src.looking_for_drive.application.flask.mapper.incoming.customer.change_destination_mapper import \
    ChangeDestinationMapper
from src.looking_for_drive.application.flask.mapper.outgoing.customer.change_destination_dto import ChangeDestinationDTO
from src.looking_for_drive.core.model.error.customer.change_destination.destination_cannot_be_changed_error import \
    DestinationCannotBeChangedError
from src.looking_for_drive.core.model.error.customer.customer_did_not_order_drive_error import \
    CustomerDidNotOrderDriveError
from src.looking_for_drive.core.use_case.customer.change_destination import ChangeDestination
from src.looking_for_drive.infrastructure.firestore.error.drive_not_found_error import DriveNotFoundError

if TYPE_CHECKING:
    from src.looking_for_drive.core.bridge.incoming.distances import Distances
    from src.looking_for_drive.core.bridge.incoming.drives import Drives


class ChangeDestinationRoute(MethodView):

    def __init__(self,
                 drives: Drives,
                 distances: Distances):
        self.change_destination = ChangeDestination(drives,
                                                    distances)

    def put(self,
            customer_id: str,
            drive_id: str) -> Tuple[Dict, int]:
        try:
            change_destination_mapper = ChangeDestinationMapper.create_from_request(request.json)
        except MissingDataError as e:
            raise InvalidUsage(F'{str(e)} is missing from body', status_code=400)
        except IncorrectDataFormatError:
            raise InvalidUsage('One or more values are in incorrect format', status_code=400)

        try:
            duration, drive = self.change_destination.handle(drive_id,
                                                             customer_id,
                                                             change_destination_mapper.destination)
        except DriveNotFoundError:
            raise InvalidUsage('Drive not found', status_code=404)
        except CustomerDidNotOrderDriveError:
            raise InvalidUsage('Customer did not order drive', status_code=403)
        except DestinationCannotBeChangedError:
            raise InvalidUsage('Destination cannot be changed', status_code=403)

        change_destination_dto = ChangeDestinationDTO.create_from_drive(drive,
                                                                        duration)
        return change_destination_dto.to_dict(), 200
