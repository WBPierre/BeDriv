import unittest
from unittest.mock import patch, MagicMock, Mock

import tests.common.infrastructure.firestore.mock_firestore_import
from src.bedriv import app
from src.looking_for_drive.core.model.drive.drive import Drive
from src.looking_for_drive.core.model.drive.location import Location
from src.looking_for_drive.core.model.error.customer.change_destination.destination_cannot_be_changed_error import \
    DestinationCannotBeChangedError
from src.looking_for_drive.core.model.error.customer.customer_did_not_order_drive_error import \
    CustomerDidNotOrderDriveError
from src.looking_for_drive.infrastructure.firestore.error.customer_not_found_error import CustomerNotFoundError
from src.looking_for_drive.infrastructure.firestore.error.drive_not_found_error import DriveNotFoundError
from tests.looking_for_drive.application.controller.route.drive_route_constants import \
    DRIVE_CUSTOMER_ROUTE_MODULE_PATH, ROUTE_PREFIX, HANDLE


class TestChangeDestinationRoute(unittest.TestCase):

    CHANGE_DESTINATION_ROUTE_MODULE_PATH = F'{DRIVE_CUSTOMER_ROUTE_MODULE_PATH}.change_destination_route'

    CHANGE_DESTINATION = F'{CHANGE_DESTINATION_ROUTE_MODULE_PATH}.ChangeDestination'

    CUSTOMER_ID = 'customer'
    DRIVE_ID = 'drive'
    CHANGE_DESTINATION_ROUTE = F'/{ROUTE_PREFIX}/customer/{CUSTOMER_ID}/changeDestination/{DRIVE_ID}'

    def setUp(self) -> None:
        self.client = app.test_client()

        self.request_body = dict(latitude=1,
                                 longitude=2)
        self.destination = Location(latitude=self.request_body['latitude'],
                                    longitude=self.request_body['longitude'])

    @patch(CHANGE_DESTINATION)
    def test_destination_has_changed(self,
                                     change_destination_mock: MagicMock):
        drive = Drive(price_estimate=5)
        duration = 60
        handle_mock = Mock(return_value=(duration, drive))
        change_destination_mock().attach_mock(handle_mock,
                                              HANDLE)

        response = self.client.put(self.CHANGE_DESTINATION_ROUTE,
                                   json=self.request_body)

        expected_response = dict(content=dict(duration=duration,
                                              estimated_price=drive.price_estimate),
                                 status_code=200)

        handle_mock.assert_called_once()
        self.assertEqual(expected_response['content'], response.json)
        self.assertEqual(expected_response['status_code'], response.status_code)

    def test_missing_key_from_body(self):
        request_body = dict(latitude=1)

        response = self.client.put(self.CHANGE_DESTINATION_ROUTE,
                                   json=request_body)

        expected_response = dict(content=dict(message="'longitude' is missing from body"),
                                 status_code=400)

        self.assertEqual(expected_response['content'], response.json)
        self.assertEqual(expected_response['status_code'], response.status_code)

    def test_incorrect_format_in_body(self):
        request_body = dict(latitude='a',
                            longitude='b')

        response = self.client.put(self.CHANGE_DESTINATION_ROUTE,
                                   json=request_body)

        expected_response = dict(content=dict(message='One or more values are in incorrect format'),
                                 status_code=400)

        self.assertEqual(expected_response['content'], response.json)
        self.assertEqual(expected_response['status_code'], response.status_code)

    @patch(CHANGE_DESTINATION)
    def test_drive_not_found(self,
                             change_destination_mock: MagicMock):
        handle_mock = Mock(side_effect=DriveNotFoundError())
        change_destination_mock().attach_mock(handle_mock,
                                              HANDLE)

        response = self.client.put(self.CHANGE_DESTINATION_ROUTE,
                                   json=self.request_body)

        expected_response = dict(content=dict(message='Drive not found'),
                                 status_code=404)

        handle_mock.assert_called_once()
        self.assertEqual(expected_response['content'], response.json)
        self.assertEqual(expected_response['status_code'], response.status_code)

    @patch(CHANGE_DESTINATION)
    def test_customer_did_not_order_drive(self,
                                          change_destination_mock: MagicMock):
        handle_mock = Mock(side_effect=CustomerDidNotOrderDriveError())
        change_destination_mock().attach_mock(handle_mock,
                                              HANDLE)

        response = self.client.put(self.CHANGE_DESTINATION_ROUTE,
                                   json=self.request_body)

        expected_response = dict(content=dict(message='Customer did not order drive'),
                                 status_code=403)

        handle_mock.assert_called_once()
        self.assertEqual(expected_response['content'], response.json)
        self.assertEqual(expected_response['status_code'], response.status_code)

    @patch(CHANGE_DESTINATION)
    def test_destination_cannot_be_changed(self,
                                           change_destination_mock: MagicMock):
        handle_mock = Mock(side_effect=DestinationCannotBeChangedError())
        change_destination_mock().attach_mock(handle_mock,
                                              HANDLE)

        response = self.client.put(self.CHANGE_DESTINATION_ROUTE,
                                   json=self.request_body)

        expected_response = dict(content=dict(message='Destination cannot be changed'),
                                 status_code=403)

        handle_mock.assert_called_once()
        self.assertEqual(expected_response['content'], response.json)
        self.assertEqual(expected_response['status_code'], response.status_code)
