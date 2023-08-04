import unittest
from unittest.mock import patch, MagicMock, Mock

import tests.common.infrastructure.firestore.mock_firestore_import

from src.bedriv import app
from src.looking_for_drive.core.model.drive.drive import Drive
from src.looking_for_drive.core.model.drive.location import Location
from src.looking_for_drive.core.model.error.driver.accept_drive.drive_is_not_in_waiting_state_error import DriveIsNotInWaitingStateError
from src.looking_for_drive.core.model.error.driver.accept_drive.driver_is_unavailable_error import DriverIsUnavailableError
from src.looking_for_drive.infrastructure.firestore.error.drive_not_found_error import DriveNotFoundError
from src.looking_for_drive.infrastructure.firestore.error.driver_not_found_error import DriverNotFoundError
from tests.looking_for_drive.application.controller.route.drive_route_constants import DRIVE_DRIVER_ROUTE_MODULE_PATH, \
    HANDLE, ROUTE_PREFIX


class TestAcceptDriveRoute(unittest.TestCase):

    ACCEPT_DRIVE_ROUTE_MODULE_PATH = F'{DRIVE_DRIVER_ROUTE_MODULE_PATH}.accept_drive_route'

    ACCEPT_DRIVE = F'{ACCEPT_DRIVE_ROUTE_MODULE_PATH}.AcceptDrive'

    DRIVE_ID = 'drive'
    DRIVER_ID = 'driver'
    ACCEPT_DRIVE_ROUTE = F'/{ROUTE_PREFIX}/accept/drive/{DRIVE_ID}/driver/{DRIVER_ID}'

    def setUp(self) -> None:
        self.client = app.test_client()

    @patch(ACCEPT_DRIVE)
    def test_drive_is_accepted(self,
                               accept_drive_mock: MagicMock):
        start_location = Location(1, 1, 'start')
        destination = Location(2, 2, 'destination')
        drive = Drive(start_location=start_location,
                      destination=destination)
        handle_mock = Mock(return_value=drive)
        accept_drive_mock().attach_mock(handle_mock, HANDLE)

        response = self.client.put(self.ACCEPT_DRIVE_ROUTE)

        expected_content = dict(start_location=dict(latitude=start_location.latitude,
                                                    longitude=start_location.longitude,
                                                    description=start_location.description),
                                destination=dict(latitude=destination.latitude,
                                                 longitude=destination.longitude,
                                                 description=destination.description))
        expected_status_code = 200

        handle_mock.assert_called_once_with(self.DRIVE_ID, self.DRIVER_ID)
        self.assertEqual(expected_content, response.json)
        self.assertEqual(expected_status_code, response.status_code)

    @patch(ACCEPT_DRIVE)
    def test_drive_not_found(self,
                             accept_drive_mock: MagicMock):
        handle_mock = Mock(side_effect=DriveNotFoundError())
        accept_drive_mock().attach_mock(handle_mock, HANDLE)

        response = self.client.put(self.ACCEPT_DRIVE_ROUTE)

        expected_content = dict(message='Drive not found')
        expected_status_code = 404

        handle_mock.assert_called_once_with(self.DRIVE_ID, self.DRIVER_ID)
        self.assertEqual(expected_content, response.json)
        self.assertEqual(expected_status_code, response.status_code)

    @patch(ACCEPT_DRIVE)
    def test_driver_not_found(self,
                              accept_drive_mock: MagicMock):
        handle_mock = Mock(side_effect=DriverNotFoundError())
        accept_drive_mock().attach_mock(handle_mock, HANDLE)

        response = self.client.put(self.ACCEPT_DRIVE_ROUTE)

        expected_content = dict(message='Driver not found')
        expected_status_code = 404

        handle_mock.assert_called_once_with(self.DRIVE_ID, self.DRIVER_ID)
        self.assertEqual(expected_content, response.json)
        self.assertEqual(expected_status_code, response.status_code)

    @patch(ACCEPT_DRIVE)
    def test_drive_is_not_in_waiting_state(self,
                                           accept_drive_mock: MagicMock):
        handle_mock = Mock(side_effect=DriveIsNotInWaitingStateError())
        accept_drive_mock().attach_mock(handle_mock, HANDLE)

        response = self.client.put(self.ACCEPT_DRIVE_ROUTE)

        expected_content = dict(message='Driver already found')
        expected_status_code = 409

        handle_mock.assert_called_once_with(self.DRIVE_ID, self.DRIVER_ID)
        self.assertEqual(expected_content, response.json)
        self.assertEqual(expected_status_code, response.status_code)

    @patch(ACCEPT_DRIVE)
    def test_driver_is_unavailable(self,
                                   accept_drive_mock: MagicMock):
        handle_mock = Mock(side_effect=DriverIsUnavailableError())
        accept_drive_mock().attach_mock(handle_mock, HANDLE)

        response = self.client.put(self.ACCEPT_DRIVE_ROUTE)

        expected_content = dict(message='Driver is unavailable')
        expected_status_code = 423

        handle_mock.assert_called_once_with(self.DRIVE_ID, self.DRIVER_ID)
        self.assertEqual(expected_content, response.json)
        self.assertEqual(expected_status_code, response.status_code)
