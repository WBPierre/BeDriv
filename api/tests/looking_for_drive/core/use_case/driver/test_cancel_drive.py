import unittest

from src.looking_for_drive.core.model.customer.customer import Customer
from src.looking_for_drive.core.model.customer.customer_drive_status import CustomerDriveStatus
from src.looking_for_drive.core.model.drive.drive import Drive
from src.looking_for_drive.core.model.drive.drive_state import accepted_state, waiting_state
from src.looking_for_drive.core.model.driver.availability import Availability
from src.looking_for_drive.core.model.driver.driver import Driver
from src.looking_for_drive.core.model.error.driver.cancel_drive.driver_cannot_cancel_drive_error import \
    DriverCannotCancelDriveError
from src.looking_for_drive.core.model.error.driver.driver_did_not_accept_drive_error import \
    DriverDidNotAcceptDriveError
from src.looking_for_drive.core.model.notification.notification import Notification
from src.looking_for_drive.core.model.notification.notification_type import NotificationType
from src.looking_for_drive.core.use_case.driver.cancel_drive import CancelDrive
from tests.looking_for_drive.core.use_case.mock_bridge.incoming.mock_drivers import MockDrivers
from tests.looking_for_drive.core.use_case.mock_bridge.incoming.mock_drives import MockDrives
from tests.looking_for_drive.core.use_case.mock_bridge.incoming.mock_notifications import MockNotifications
from tests.looking_for_drive.core.use_case.mock_bridge.incoming.mock_publisher import MockPublisher


class TestCancelDrive(unittest.TestCase):

    def setUp(self) -> None:
        self.drives = MockDrives()
        self.drivers = MockDrivers()
        self.notifications = MockNotifications()
        self.publisher = MockPublisher()
        self.cancel_drive = CancelDrive(self.drives,
                                        self.drivers,
                                        self.notifications,
                                        self.publisher)

        self.driver = Driver(driver_id='cancel',
                             name='Alex',
                             available=Availability.UNAVAILABLE)
        self.drivers.drivers[self.driver.id] = self.driver

        self.customer = Customer(customer_id='cancel',
                                 name='Pierre',
                                 drive_status=CustomerDriveStatus.ACTIVE,
                                 device_token='cancel_customer')

        self.drive = Drive(drive_id='cancel',
                           state=accepted_state,
                           driver=self.driver,
                           customer=self.customer)
        self.drives.drives[self.drive.id] = self.drive

    def test_drive_is_canceled(self):
        self.cancel_drive.handle(self.driver.id,
                                 self.drive.id)

        updated_drive = self.drives.drives[self.drive.id]
        updated_driver = self.drivers.drivers[self.driver.id]

        self.assertEqual(waiting_state, updated_drive.state)
        self.assertEqual(Availability.AVAILABLE, updated_driver.available)
        self.assertIn(dict(to=self.customer.device_token,
                           message=Notification(type_=NotificationType.DRIVER_CANCELLED_DRIVE,
                                                title='Drive cancelled',
                                                body='Drive has been cancelled').to_dict()),
                      self.notifications.notifications)
        self.assertIn(self.driver.id,
                      self.drives.declined_drivers)

    def test_driver_did_not_accept_drive(self):
        driver = Driver(driver_id='different',
                        name='Pierre',
                        available=Availability.UNAVAILABLE)
        self.drivers.drivers[driver.id] = driver

        with self.assertRaises(DriverDidNotAcceptDriveError):
            self.cancel_drive.handle(driver.id,
                                     self.drive.id)

    def test_driver_cannot_cancel_drive(self):
        drive = Drive(drive_id='not_accepted',
                      driver=self.driver)
        self.drives.drives[drive.id] = drive

        with self.assertRaises(DriverCannotCancelDriveError):
            self.cancel_drive.handle(self.driver.id,
                                     drive.id)
