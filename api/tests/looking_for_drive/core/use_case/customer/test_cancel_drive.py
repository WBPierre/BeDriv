import unittest

from src.looking_for_drive.core.model.customer.cancellation_fee import CancellationFee
from src.looking_for_drive.core.model.customer.customer import Customer
from src.looking_for_drive.core.model.customer.customer_drive_status import CustomerDriveStatus
from src.looking_for_drive.core.model.drive.drive import Drive
from src.looking_for_drive.core.model.drive.drive_state import cancelled_state, accepted_state
from src.looking_for_drive.core.model.driver.availability import Availability
from src.looking_for_drive.core.model.driver.driver import Driver
from src.looking_for_drive.core.model.error.customer.cancel_drive.customer_cannot_cancel_drive_error import \
    CustomerCannotCancelDriveError
from src.looking_for_drive.core.model.error.customer.customer_did_not_order_drive_error import \
    CustomerDidNotOrderDriveError
from src.looking_for_drive.core.model.notification.notification import Notification
from src.looking_for_drive.core.model.notification.notification_type import NotificationType
from src.looking_for_drive.core.use_case.customer.cancel_drive import CancelDrive
from tests.looking_for_drive.core.use_case.mock_bridge.incoming.mock_customers import MockCustomers
from tests.looking_for_drive.core.use_case.mock_bridge.incoming.mock_drivers import MockDrivers
from tests.looking_for_drive.core.use_case.mock_bridge.incoming.mock_drives import MockDrives
from tests.looking_for_drive.core.use_case.mock_bridge.incoming.mock_notifications import MockNotifications


class TestCancelDrive(unittest.TestCase):

    def setUp(self) -> None:
        self.drives = MockDrives()
        self.customers = MockCustomers()
        self.drivers = MockDrivers()
        self.notifications = MockNotifications()
        self.cancel_drive = CancelDrive(self.drives,
                                        self.customers,
                                        self.drivers,
                                        self.notifications)

        self.customer_can_cancel = Customer(customer_id='can_cancel',
                                            name='Alex',
                                            drive_status=CustomerDriveStatus.ACTIVE)
        self.customers.customers[self.customer_can_cancel.id] = self.customer_can_cancel

    def test_drive_is_canceled_without_fee(self):
        drive = Drive(drive_id='drive',
                      customer=self.customer_can_cancel)
        self.drives.drives[drive.id] = drive

        self.cancel_drive.handle(self.customer_can_cancel.id,
                                 drive.id)

        updated_customer = self.customers.customers[self.customer_can_cancel.id]
        updated_drive = self.drives.drives[drive.id]

        self.assertEqual(CustomerDriveStatus.INACTIVE, updated_customer.drive_status)
        self.assertEqual(updated_drive.state, cancelled_state)
        self.assertIsNotNone(updated_drive.cancelled_time)
        self.assertEqual(CancellationFee.NONE.value, updated_drive.actual_price)

    def test_drive_is_canceled_with_fee(self):
        driver_device_token = 'cancel_token'
        driver = Driver(driver_id='cancelled_driver',
                        name='Pierre',
                        available=Availability.UNAVAILABLE,
                        device_token=driver_device_token)
        self.drivers.drivers[driver.id] = driver

        drive = Drive(drive_id='drive',
                      customer=self.customer_can_cancel,
                      driver=driver,
                      state=accepted_state)
        self.drives.drives[drive.id] = drive

        self.cancel_drive.handle(self.customer_can_cancel.id,
                                 drive.id)

        updated_customer = self.customers.customers[self.customer_can_cancel.id]
        updated_driver = self.drivers.drivers[driver.id]
        updated_drive = self.drives.drives[drive.id]

        self.assertEqual(CustomerDriveStatus.INACTIVE, updated_customer.drive_status)
        self.assertEqual(Availability.AVAILABLE, updated_driver.available)
        self.assertEqual(updated_drive.state, cancelled_state)
        self.assertIsNotNone(updated_drive.cancelled_time)
        self.assertEqual(CancellationFee.DRIVER_FOUND, updated_drive.actual_price)
        self.assertIn(dict(to=driver_device_token,
                           message=Notification(type_=NotificationType.CUSTOMER_CANCELLED_DRIVE,
                                                title='Drive cancelled',
                                                body='Drive has been cancelled').to_dict()),
                      self.notifications.notifications)

    def test_customer_did_not_order_drive(self):
        customer = Customer(customer_id='different_customer',
                            name='Michel',
                            drive_status=CustomerDriveStatus.ACTIVE)
        self.customers.customers[customer.id] = customer

        drive = Drive(drive_id='customer_did_not_order_drive',
                      customer=self.customer_can_cancel)
        self.drives.drives[drive.id] = drive

        with self.assertRaises(CustomerDidNotOrderDriveError):
            self.cancel_drive.handle(customer.id,
                                     drive.id)

    def test_drive_cannot_be_cancelled(self):
        drive = Drive(drive_id='drive_cannot_be_cancelled',
                      customer=self.customer_can_cancel,
                      state=cancelled_state)
        self.drives.drives[drive.id] = drive

        with self.assertRaises(CustomerCannotCancelDriveError):
            self.cancel_drive.handle(self.customer_can_cancel.id,
                                     drive.id)
