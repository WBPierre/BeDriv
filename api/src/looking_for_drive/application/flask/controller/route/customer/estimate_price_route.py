from typing import Dict, Tuple

from flask.views import MethodView

from src.common.application.flask.error.invalid_usage import InvalidUsage
from src.looking_for_drive.application.flask.error.incorrect_data_format_error import IncorrectDataFormatError
from src.looking_for_drive.application.flask.mapper.incoming.request_to_start_and_destination_mapper import \
    RequestToStartAndDestinationMapper
from src.looking_for_drive.core.bridge.incoming.distances import Distances
from src.looking_for_drive.core.use_case.customer.estimate_price import EstimatePrice
from src.looking_for_drive.infrastructure.google.distance_matrix.error.distance_matrix_error import DistanceMatrixError


class EstimatePriceRoute(MethodView):

    def __init__(self,
                 distances: Distances) -> None:
        self.estimate_price = EstimatePrice(distances)

    def get(self,
            start: str,
            destination: str) -> Tuple[Dict, int]:
        try:
            start_and_destination = RequestToStartAndDestinationMapper\
                .create_start_and_destination_from_request(start,
                                                           destination)
        except IncorrectDataFormatError:
            raise InvalidUsage('The provided data is incorrect', status_code=400)

        try:
            price = self.estimate_price.handle(start_and_destination.start,
                                               start_and_destination.destination)
        except DistanceMatrixError as e:
            raise InvalidUsage(e.message, status_code=e.status_code)

        return price.to_dict(), 200
