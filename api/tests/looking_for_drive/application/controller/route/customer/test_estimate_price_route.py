import unittest
from unittest.mock import patch, MagicMock, Mock

from src.bedriv import app
from src.looking_for_drive.application.flask.error.incorrect_data_format_error import IncorrectDataFormatError
from src.looking_for_drive.application.flask.mapper.incoming.request_to_start_and_destination_mapper import \
    RequestToStartAndDestinationMapper
from src.looking_for_drive.core.model.drive.location import Location
from src.looking_for_drive.core.model.drive.pricing import Pricing
from src.looking_for_drive.infrastructure.google.distance_matrix.error.distance_matrix_error import DistanceMatrixError
from tests.looking_for_drive.application.controller.route.drive_route_constants import \
    DRIVE_ROUTE, DRIVE_CUSTOMER_ROUTE_MODULE_PATH, HANDLE


class TestEstimatePriceRoute(unittest.TestCase):

    ESTIMATE_PRICE_MODULE_PATH = F'{DRIVE_CUSTOMER_ROUTE_MODULE_PATH}.estimate_price_route'

    ESTIMATE_PRICE = F'{ESTIMATE_PRICE_MODULE_PATH}.EstimatePrice'

    REQUEST_TO_START_AND_DESTINATION_MAPPER = F'{ESTIMATE_PRICE_MODULE_PATH}.RequestToStartAndDestinationMapper'
    CREATE_START_AND_DESTINATION_FROM_REQUEST = 'create_start_and_destination_from_request'

    START = '1,1'
    DESTINATION = '2,2'
    ESTIMATE_PRICE_ROUTE = F'/{DRIVE_ROUTE}/estimatePrice/{START}/{DESTINATION}'

    def setUp(self) -> None:
        self.client = app.test_client()

    @patch(ESTIMATE_PRICE)
    @patch(REQUEST_TO_START_AND_DESTINATION_MAPPER)
    def test_price_is_estimated(self,
                                request_to_start_and_destination_mapper_mock: MagicMock,
                                estimate_price_mock: MagicMock):
        converted_start = Location(1, 1)
        converted_destination = Location(2, 2)
        start_and_destination = RequestToStartAndDestinationMapper(start=converted_start,
                                                                        destination=converted_destination)
        create_start_and_destination_from_request_mock = Mock(return_value=start_and_destination)
        request_to_start_and_destination_mapper_mock.attach_mock(create_start_and_destination_from_request_mock,
                                                                 self.CREATE_START_AND_DESTINATION_FROM_REQUEST)

        pricing = Pricing(distance=1,
                          duration=1,
                          price=1)
        handle_mock = Mock(return_value=pricing)
        estimate_price_mock().attach_mock(handle_mock, HANDLE)

        res = self.client.get(self.ESTIMATE_PRICE_ROUTE)

        expected_response = dict(content=pricing.to_dict(),
                                 status_code=200)
        create_start_and_destination_from_request_mock.assert_called_once_with(self.START,
                                                                               self.DESTINATION)
        handle_mock.assert_called_once_with(converted_start, converted_destination)
        self.assertEqual(expected_response['content'], res.json)
        self.assertEqual(expected_response['status_code'], res.status_code)

    @patch(REQUEST_TO_START_AND_DESTINATION_MAPPER)
    def test_data_is_incorrect_when_estimate_price(self,
                                                   request_to_start_and_destination_mapper_mock: MagicMock):
        create_start_and_destination_from_request_mock = Mock(side_effect=IncorrectDataFormatError())
        request_to_start_and_destination_mapper_mock.attach_mock(create_start_and_destination_from_request_mock,
                                                                 self.CREATE_START_AND_DESTINATION_FROM_REQUEST)

        res = self.client.get(self.ESTIMATE_PRICE_ROUTE)

        expected_content = dict(message='The provided data is incorrect')
        expected_status_code = 400

        self.assertEqual(expected_content, res.json)
        self.assertEqual(expected_status_code, res.status_code)

    @patch(ESTIMATE_PRICE)
    @patch(REQUEST_TO_START_AND_DESTINATION_MAPPER)
    def test_error_with_distance_matrix_api(self,
                                            request_to_start_and_destination_mapper_mock: MagicMock,
                                            estimate_price_mock: MagicMock):
        expected_response = dict(content=dict(message='test'),
                                 status_code=404)
        handle_mock = Mock(side_effect=DistanceMatrixError(expected_response['content']['message'],
                                                           status_code=expected_response['status_code']))
        estimate_price_mock().attach_mock(handle_mock,
                                          HANDLE)

        response = self.client.get(self.ESTIMATE_PRICE_ROUTE)

        request_to_start_and_destination_mapper_mock.create_start_and_destination_from_request\
            .assert_called_once_with(self.START,
                                     self.DESTINATION)
        handle_mock.assert_called_once()
        self.assertEqual(expected_response['content'], response.json)
        self.assertEqual(expected_response['status_code'], response.status_code)
