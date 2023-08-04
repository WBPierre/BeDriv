import unittest
from datetime import datetime
from unittest.mock import patch, MagicMock, Mock

from src.bedriv import app
from src.looking_for_drive.core.model.drive.drive import Drive
from src.looking_for_drive.core.model.error.driver.driver_did_not_accept_drive_error import DriverDidNotAcceptDriveError
from src.looking_for_drive.core.model.error.driver.finish_drive.customer_is_not_picked_up_error import \
    CustomerIsNotPickedUpError
from src.looking_for_drive.infrastructure.firestore.error.drive_not_found_error import DriveNotFoundError
from src.looking_for_drive.infrastructure.google.distance_matrix.error.distance_matrix_error import DistanceMatrixError
from tests.looking_for_drive.application.controller.route.drive_route_constants import DRIVE_DRIVER_ROUTE_MODULE_PATH, \
    ROUTE_PREFIX, HANDLE


class TestFinishDriveRoute(unittest.TestCase):

    FINISH_DRIVE_ROUTE_MODULE_PATH = F'{DRIVE_DRIVER_ROUTE_MODULE_PATH}.finish_drive_route'

    FINISH_DRIVE = F'{FINISH_DRIVE_ROUTE_MODULE_PATH}.FinishDrive'

    DRIVE_ID = 'drive'
    DRIVER_ID = 'driver'
    FINISH_DRIVE_ROUTE = F'/{ROUTE_PREFIX}/finishDrive/{DRIVE_ID}/by/{DRIVER_ID}'

    def setUp(self) -> None:
        self.client = app.test_client()

    @patch(FINISH_DRIVE)
    def test_drive_is_finished(self,
                               finish_drive_mock: MagicMock):
        drive = Drive(end_time=datetime.now(),
                      actual_price=5)
        handle_mock = Mock(return_value=drive)
        finish_drive_mock().attach_mock(handle_mock,
                                        HANDLE)

        response = self.client.put(self.FINISH_DRIVE_ROUTE)

        expected_response = dict(content=dict(end_time=drive.end_time,
                                              price=drive.actual_price),
                                 status_code=200)

        handle_mock.assert_called_once_with(self.DRIVE_ID,
                                            self.DRIVER_ID)
        self.assertEqual(expected_response['content']['price'], response.json['price'])
        self.assertIsNotNone(response.json.get('end_time'))
        self.assertEqual(expected_response['status_code'], response.status_code)

    @patch(FINISH_DRIVE)
    def test_drive_not_found(self,
                             finish_drive_mock: MagicMock):
        handle_mock = Mock(side_effect=DriveNotFoundError())
        finish_drive_mock().attach_mock(handle_mock,
                                        HANDLE)

        response = self.client.put(self.FINISH_DRIVE_ROUTE)

        expected_response = dict(content=dict(message='Drive not found'),
                                 status_code=404)

        handle_mock.assert_called_once_with(self.DRIVE_ID,
                                            self.DRIVER_ID)
        self.assertEqual(expected_response['content'], response.json)
        self.assertEqual(expected_response['status_code'], response.status_code)

    @patch(FINISH_DRIVE)
    def test_error_with_distance_matrix_api(self,
                                            finish_drive_mock: MagicMock):
        message = 'Test'
        status_code = 400
        handle_mock = Mock(side_effect=DistanceMatrixError(message=message,
                                                           status_code=status_code))
        finish_drive_mock().attach_mock(handle_mock,
                                        HANDLE)

        response = self.client.put(self.FINISH_DRIVE_ROUTE)

        expected_response = dict(content=dict(message=message),
                                 status_code=status_code)

        handle_mock.assert_called_once_with(self.DRIVE_ID,
                                            self.DRIVER_ID)
        self.assertEqual(expected_response['content'], response.json)
        self.assertEqual(expected_response['status_code'], response.status_code)

    @patch(FINISH_DRIVE)
    def test_driver_did_not_order_drive(self,
                                        finish_drive_mock: MagicMock):
        handle_mock = Mock(side_effect=DriverDidNotAcceptDriveError())
        finish_drive_mock().attach_mock(handle_mock,
                                        HANDLE)

        response = self.client.put(self.FINISH_DRIVE_ROUTE)

        expected_response = dict(content=dict(message='Driver did not accept drive'),
                                 status_code=403)

        handle_mock.assert_called_once_with(self.DRIVE_ID,
                                            self.DRIVER_ID)
        self.assertEqual(expected_response['content'], response.json)
        self.assertEqual(expected_response['status_code'], response.status_code)

    @patch(FINISH_DRIVE)
    def test_customer_is_not_picked_up(self,
                                       finish_drive_mock: MagicMock):
        handle_mock = Mock(side_effect=CustomerIsNotPickedUpError())
        finish_drive_mock().attach_mock(handle_mock,
                                        HANDLE)

        response = self.client.put(self.FINISH_DRIVE_ROUTE)

        expected_response = dict(content=dict(message='Customer is not picked up'),
                                 status_code=403)

        handle_mock.assert_called_once_with(self.DRIVE_ID,
                                            self.DRIVER_ID)
        self.assertEqual(expected_response['content'], response.json)
        self.assertEqual(expected_response['status_code'], response.status_code)
