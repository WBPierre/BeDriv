import unittest

from src.looking_for_drive.core.model.customer.customer import Customer
from src.looking_for_drive.core.model.customer.customer_drive_status import CustomerDriveStatus
from src.looking_for_drive.core.model.drive.drive import Drive
from src.looking_for_drive.core.model.drive.drive_state import accepted_state
from src.looking_for_drive.core.model.driver.availability import Availability
from src.looking_for_drive.core.model.error.driver.accept_drive.drive_is_not_in_waiting_state_error import DriveIsNotInWaitingStateError
from src.looking_for_drive.core.model.error.driver.accept_drive.driver_is_unavailable_error import DriverIsUnavailableError
from src.looking_for_drive.core.model.notification.notification import Notification
from src.looking_for_drive.core.model.notification.notification_type import NotificationType
from src.looking_for_drive.core.use_case.driver.accept_drive import AcceptDrive
from tests.looking_for_drive.core.use_case.mock_bridge.incoming.mock_drivers import MockDrivers
from tests.looking_for_drive.core.use_case.mock_bridge.incoming.mock_drives import MockDrives
from tests.looking_for_drive.core.use_case.mock_bridge.incoming.mock_notifications import MockNotifications


class TestAcceptDrive(unittest.TestCase):

    def setUp(self) -> None:
        self.drives = MockDrives()
        self.drivers = MockDrivers()
        self.notifications = MockNotifications()
        self.accept_drive = AcceptDrive(self.drives,
                                        self.drivers,
                                        self.notifications)

    def test_drive_is_accepted(self):
        driver_id = MockDrivers.OK_DRIVER
        customer = Customer(customer_id='customer',
                            name='Alex',
                            drive_status=CustomerDriveStatus.ACTIVE,
                            device_token='accepted')
        drive = Drive(drive_id='drive_is_accepted',
                      customer=customer)
        drive_id = drive.id
        self.drives.drives[drive_id] = drive
        driver = self.drivers.find_by_id(driver_id)

        self.accept_drive.handle(drive_id=drive_id,
                                 driver_id=driver_id)

        updated_drive = self.drives.find_by_id(drive_id)

        self.assertEqual(updated_drive.state, accepted_state)
        self.assertIsNotNone(updated_drive.accepted_time)
        self.assertEqual(driver.id, updated_drive.driver.id)
        self.assertEqual(Availability.UNAVAILABLE, updated_drive.driver.available)
        self.assertIn(dict(to=updated_drive.customer.device_token,
                           message=Notification(type_=NotificationType.DRIVER_ACCEPTED_DRIVE,
                                                title='Drive accepted',
                                                body=F'Drive has been accepted by {driver.name}').to_dict()),
                      self.notifications.notifications)

    def test_drive_is_not_in_waiting_state(self):
        drive_id = MockDrives.DRIVE_NOT_IN_WAITING
        driver_id = MockDrivers.OK_DRIVER

        with self.assertRaises(DriveIsNotInWaitingStateError):
            self.accept_drive.handle(drive_id=drive_id,
                                     driver_id=driver_id)

    def test_driver_is_unavailable(self):
        drive_id = MockDrives.OK_DRIVE
        driver_id = MockDrivers.UNAVAILABLE_DRIVER

        with self.assertRaises(DriverIsUnavailableError):
            self.accept_drive.handle(drive_id=drive_id,
                                     driver_id=driver_id)
