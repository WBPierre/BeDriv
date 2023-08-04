import unittest
from unittest.mock import patch, MagicMock, Mock

from src.bedriv import app
from src.looking_for_drive.core.model.error.driver.cancel_drive.driver_cannot_cancel_drive_error import \
    DriverCannotCancelDriveError
from src.looking_for_drive.core.model.error.driver.driver_did_not_accept_drive_error import \
    DriverDidNotAcceptDriveError
from src.looking_for_drive.infrastructure.firestore.error.drive_not_found_error import DriveNotFoundError
from src.looking_for_drive.infrastructure.firestore.error.driver_not_found_error import DriverNotFoundError
from tests.looking_for_drive.application.controller.route.drive_route_constants import DRIVE_DRIVER_ROUTE_MODULE_PATH, \
    ROUTE_PREFIX, HANDLE


class TestDriverCancelRoute(unittest.TestCase):

    CANCEL_DRIVE_ROUTE_MODULE_PATH = F'{DRIVE_DRIVER_ROUTE_MODULE_PATH}.driver_cancel_drive_route'

    CANCEL_DRIVE = F'{CANCEL_DRIVE_ROUTE_MODULE_PATH}.CancelDrive'

    DRIVER_ID = 'driver'
    DRIVE_ID = 'drive'
    CANCEL_DRIVE_ROUTE = F'/{ROUTE_PREFIX}/driver/{DRIVER_ID}/cancel/drive/{DRIVE_ID}'

    def setUp(self) -> None:
        self.client = app.test_client()

    @patch(CANCEL_DRIVE)
    def test_drive_is_cancelled(self,
                                cancel_drive_mock: MagicMock):
        response = self.client.put(self.CANCEL_DRIVE_ROUTE)

        expected_response = dict(content=dict(message='Drive cancelled'),
                                 status_code=200)

        cancel_drive_mock().handle.assert_called_once_with(self.DRIVER_ID,
                                                           self.DRIVE_ID)
        self.assertEqual(expected_response['content'], response.json)
        self.assertEqual(expected_response['status_code'], response.status_code)

    @patch(CANCEL_DRIVE)
    def test_drive_not_found(self,
                             cancel_drive_mock: MagicMock):
        handle_mock = Mock(side_effect=DriveNotFoundError())
        cancel_drive_mock().attach_mock(handle_mock,
                                        HANDLE)

        response = self.client.put(self.CANCEL_DRIVE_ROUTE)

        expected_response = dict(content=dict(message='Drive not found'),
                                 status_code=404)

        handle_mock.assert_called_once_with(self.DRIVER_ID,
                                            self.DRIVE_ID)
        self.assertEqual(expected_response['content'], response.json)
        self.assertEqual(expected_response['status_code'], response.status_code)

    @patch(CANCEL_DRIVE)
    def test_driver_not_found(self,
                              cancel_drive_mock: MagicMock):
        handle_mock = Mock(side_effect=DriverNotFoundError())
        cancel_drive_mock().attach_mock(handle_mock,
                                        HANDLE)

        response = self.client.put(self.CANCEL_DRIVE_ROUTE)

        expected_response = dict(content=dict(message='Driver not found'),
                                 status_code=404)

        handle_mock.assert_called_once_with(self.DRIVER_ID,
                                            self.DRIVE_ID)
        self.assertEqual(expected_response['content'], response.json)
        self.assertEqual(expected_response['status_code'], response.status_code)

    @patch(CANCEL_DRIVE)
    def test_driver_did_not_accept_drive(self,
                                         cancel_drive_mock: MagicMock):
        handle_mock = Mock(side_effect=DriverDidNotAcceptDriveError())
        cancel_drive_mock().attach_mock(handle_mock,
                                        HANDLE)

        response = self.client.put(self.CANCEL_DRIVE_ROUTE)

        expected_response = dict(content=dict(message='Driver did not accept drive'),
                                 status_code=403)

        handle_mock.assert_called_once_with(self.DRIVER_ID,
                                            self.DRIVE_ID)
        self.assertEqual(expected_response['content'], response.json)
        self.assertEqual(expected_response['status_code'], response.status_code)

    @patch(CANCEL_DRIVE)
    def test_driver_cannot_cancel_drive(self,
                                        cancel_drive_mock: MagicMock):
        handle_mock = Mock(side_effect=DriverCannotCancelDriveError())
        cancel_drive_mock().attach_mock(handle_mock,
                                        HANDLE)

        response = self.client.put(self.CANCEL_DRIVE_ROUTE)

        expected_response = dict(content=dict(message="Driver can't cancel drive"),
                                 status_code=403)

        handle_mock.assert_called_once_with(self.DRIVER_ID,
                                            self.DRIVE_ID)
        self.assertEqual(expected_response['content'], response.json)
        self.assertEqual(expected_response['status_code'], response.status_code)