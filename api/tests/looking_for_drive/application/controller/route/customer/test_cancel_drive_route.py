import unittest
from datetime import datetime
from unittest.mock import patch, MagicMock, Mock

import tests.common.infrastructure.firestore.mock_firestore_import

from src.bedriv import app
from src.looking_for_drive.core.model.drive.drive import Drive
from src.looking_for_drive.core.model.error.customer.cancel_drive.customer_cannot_cancel_drive_error import \
    CustomerCannotCancelDriveError
from src.looking_for_drive.core.model.error.customer.customer_did_not_order_drive_error import \
    CustomerDidNotOrderDriveError
from src.looking_for_drive.infrastructure.firestore.error.customer_not_found_error import CustomerNotFoundError
from src.looking_for_drive.infrastructure.firestore.error.drive_not_found_error import DriveNotFoundError
from tests.looking_for_drive.application.controller.route.drive_route_constants import DRIVE_CUSTOMER_ROUTE_MODULE_PATH, \
    ROUTE_PREFIX, HANDLE


class TestCancelDriveRoute(unittest.TestCase):

    CANCEL_DRIVE_ROUTE_MODULE_PATH = F'{DRIVE_CUSTOMER_ROUTE_MODULE_PATH}.cancel_drive_route'

    CANCEL_DRIVE = F'{CANCEL_DRIVE_ROUTE_MODULE_PATH}.CancelDrive'

    CUSTOMER_ID = 'customer'
    DRIVE_ID = 'drive'
    CANCEL_DRIVE_ROUTE = F'/{ROUTE_PREFIX}/customer/{CUSTOMER_ID}/cancel/drive/{DRIVE_ID}'

    def setUp(self) -> None:
        self.client = app.test_client()

    @patch(F'{CANCEL_DRIVE}')
    def test_drive_is_cancelled(self,
                                cancel_drive_mock: MagicMock):
        expected_response = dict(content=dict(price=0,
                                              cancelled_time=datetime.now()),
                                 status_code=200)
        drive = Drive(actual_price=expected_response['content']['price'],
                      cancelled_time=expected_response['content']['cancelled_time'])
        handle_mock = Mock(return_value=drive)
        cancel_drive_mock().attach_mock(handle_mock,
                                        HANDLE)

        response = self.client.put(self.CANCEL_DRIVE_ROUTE)

        handle_mock.assert_called_once_with(self.CUSTOMER_ID,
                                            self.DRIVE_ID)

        self.assertEqual(expected_response['content']['price'], response.json['price'])
        self.assertIsNotNone(response.json.get('cancelled_time'))
        self.assertEqual(expected_response['status_code'], response.status_code)

    @patch(F'{CANCEL_DRIVE}')
    def test_customer_not_found(self,
                                cancel_drive_mock: MagicMock):
        handle_mock = Mock(side_effect=CustomerNotFoundError())
        cancel_drive_mock().attach_mock(handle_mock,
                                        HANDLE)

        response = self.client.put(self.CANCEL_DRIVE_ROUTE)

        expected_content = dict(message='Customer not found')
        expected_status_code = 404

        handle_mock.assert_called_once_with(self.CUSTOMER_ID,
                                            self.DRIVE_ID)
        self.assertEqual(expected_content, response.json)
        self.assertEqual(expected_status_code, response.status_code)

    @patch(F'{CANCEL_DRIVE}')
    def test_drive_not_found(self,
                             cancel_drive_mock: MagicMock):
        handle_mock = Mock(side_effect=DriveNotFoundError())
        cancel_drive_mock().attach_mock(handle_mock,
                                        HANDLE)

        response = self.client.put(self.CANCEL_DRIVE_ROUTE)

        expected_content = dict(message='Drive not found')
        expected_status_code = 404

        handle_mock.assert_called_once_with(self.CUSTOMER_ID,
                                            self.DRIVE_ID)
        self.assertEqual(expected_content, response.json)
        self.assertEqual(expected_status_code, response.status_code)

    @patch(F'{CANCEL_DRIVE}')
    def test_customer_did_not_order_drive(self,
                                          cancel_drive_mock: MagicMock):
        handle_mock = Mock(side_effect=CustomerDidNotOrderDriveError())
        cancel_drive_mock().attach_mock(handle_mock,
                                        HANDLE)

        response = self.client.put(self.CANCEL_DRIVE_ROUTE)

        expected_content = dict(message='Customer did not order drive')
        expected_status_code = 403

        handle_mock.assert_called_once_with(self.CUSTOMER_ID,
                                            self.DRIVE_ID)
        self.assertEqual(expected_content, response.json)
        self.assertEqual(expected_status_code, response.status_code)

    @patch(F'{CANCEL_DRIVE}')
    def test_customer_cannot_cancel_drive(self,
                                          cancel_drive_mock: MagicMock):
        handle_mock = Mock(side_effect=CustomerCannotCancelDriveError())
        cancel_drive_mock().attach_mock(handle_mock,
                                        HANDLE)

        response = self.client.put(self.CANCEL_DRIVE_ROUTE)

        expected_content = dict(message="Customer can't cancel drive")
        expected_status_code = 403

        handle_mock.assert_called_once_with(self.CUSTOMER_ID,
                                            self.DRIVE_ID)
        self.assertEqual(expected_content, response.json)
        self.assertEqual(expected_status_code, response.status_code)
