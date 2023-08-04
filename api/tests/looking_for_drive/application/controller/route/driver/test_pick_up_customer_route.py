import unittest
from datetime import datetime
from unittest.mock import patch, MagicMock, Mock

import tests.common.infrastructure.firestore.mock_firestore_import
from src.bedriv import app
from src.looking_for_drive.core.model.drive.drive import Drive
from src.looking_for_drive.core.model.error.driver.driver_did_not_accept_drive_error import DriverDidNotAcceptDriveError
from src.looking_for_drive.core.model.error.driver.pick_up_customer.drive_is_not_accepted_error import \
    DriveIsNotAcceptedError
from src.looking_for_drive.infrastructure.firestore.error.drive_not_found_error import DriveNotFoundError
from tests.looking_for_drive.application.controller.route.drive_route_constants import DRIVE_DRIVER_ROUTE_MODULE_PATH, \
    ROUTE_PREFIX, HANDLE


class TestPickUpCustomerRoute(unittest.TestCase):

    PICK_UP_CUSTOMER_ROUTE_MODULE_PATH = F'{DRIVE_DRIVER_ROUTE_MODULE_PATH}.pick_up_customer_route'

    PICK_UP_CUSTOMER = F'{PICK_UP_CUSTOMER_ROUTE_MODULE_PATH}.PickUpCustomer'

    DRIVER_ID = 'driver'
    DRIVE_ID = 'drive'
    PICK_UP_CUSTOMER_ROUTE = F'/{ROUTE_PREFIX}/driver/{DRIVER_ID}/pickUp/{DRIVE_ID}'

    def setUp(self) -> None:
        self.client = app.test_client()

    @patch(PICK_UP_CUSTOMER)
    def test_customer_is_picked_up(self,
                                   pick_up_customer_mock: MagicMock):
        drive = Drive(picked_up_time=datetime.now())
        handle_mock = Mock(return_value=drive)
        pick_up_customer_mock().attach_mock(handle_mock,
                                            HANDLE)

        response = self.client.put(self.PICK_UP_CUSTOMER_ROUTE)

        expected_response = dict(content=dict(picked_up_time=drive.picked_up_time),
                                 status_code=200)

        handle_mock.assert_called_once_with(drive_id=self.DRIVE_ID,
                                            driver_id=self.DRIVER_ID)
        self.assertEqual(expected_response['status_code'], response.status_code)
        self.assertIsNotNone(response.json.get('picked_up_time'))

    @patch(PICK_UP_CUSTOMER)
    def test_drive_not_found(self,
                             pick_up_customer_mock: MagicMock):
        handle_mock = Mock(side_effect=DriveNotFoundError())
        pick_up_customer_mock().attach_mock(handle_mock,
                                            HANDLE)

        response = self.client.put(self.PICK_UP_CUSTOMER_ROUTE)

        expected_response = dict(content=dict(message='Drive not found'),
                                 status_code=404)

        handle_mock.assert_called_once_with(drive_id=self.DRIVE_ID,
                                            driver_id=self.DRIVER_ID)
        self.assertEqual(expected_response['content'], response.json)
        self.assertEqual(expected_response['status_code'], response.status_code)

    @patch(PICK_UP_CUSTOMER)
    def test_driver_did_not_accept_drive(self,
                                         pick_up_customer_mock: MagicMock):
        handle_mock = Mock(side_effect=DriverDidNotAcceptDriveError())
        pick_up_customer_mock().attach_mock(handle_mock,
                                            HANDLE)

        response = self.client.put(self.PICK_UP_CUSTOMER_ROUTE)

        expected_response = dict(content=dict(message='Driver did not accept drive'),
                                 status_code=403)

        handle_mock.assert_called_once_with(drive_id=self.DRIVE_ID,
                                            driver_id=self.DRIVER_ID)
        self.assertEqual(expected_response['content'], response.json)
        self.assertEqual(expected_response['status_code'], response.status_code)

    @patch(PICK_UP_CUSTOMER)
    def test_drive_is_not_accepted(self,
                                   pick_up_customer_mock: MagicMock):
        handle_mock = Mock(side_effect=DriveIsNotAcceptedError())
        pick_up_customer_mock().attach_mock(handle_mock,
                                            HANDLE)

        response = self.client.put(self.PICK_UP_CUSTOMER_ROUTE)

        expected_response = dict(content=dict(message='Drive is not accepted'),
                                 status_code=403)

        handle_mock.assert_called_once_with(drive_id=self.DRIVE_ID,
                                            driver_id=self.DRIVER_ID)
        self.assertEqual(expected_response['content'], response.json)
        self.assertEqual(expected_response['status_code'], response.status_code)
