import unittest
from datetime import datetime

from src.looking_for_drive.core.model.customer.customer import Customer
from src.looking_for_drive.core.model.customer.customer_drive_status import CustomerDriveStatus
from src.looking_for_drive.core.model.drive.drive import Drive
from src.looking_for_drive.core.model.drive.drive_state import picked_up_state, finished_state
from src.looking_for_drive.core.model.driver.availability import Availability
from src.looking_for_drive.core.model.driver.driver import Driver
from src.looking_for_drive.core.model.error.driver.driver_did_not_accept_drive_error import DriverDidNotAcceptDriveError
from src.looking_for_drive.core.model.error.driver.finish_drive.customer_is_not_picked_up_error import \
    CustomerIsNotPickedUpError
from src.looking_for_drive.core.model.notification.notification import Notification
from src.looking_for_drive.core.model.notification.notification_type import NotificationType
from src.looking_for_drive.core.use_case.driver.finish_drive import FinishDrive
from tests.looking_for_drive.core.use_case.mock_bridge.incoming.mock_blockchain import MockBlockChain
from tests.looking_for_drive.core.use_case.mock_bridge.incoming.mock_customers import MockCustomers
from tests.looking_for_drive.core.use_case.mock_bridge.incoming.mock_distances import MockDistances
from tests.looking_for_drive.core.use_case.mock_bridge.incoming.mock_drivers import MockDrivers
from tests.looking_for_drive.core.use_case.mock_bridge.incoming.mock_drives import MockDrives
from tests.looking_for_drive.core.use_case.mock_bridge.incoming.mock_notifications import MockNotifications
from tests.looking_for_drive.core.use_case.mock_bridge.incoming.mock_payments import MockPayments


class TestFinishDrive(unittest.TestCase):

    def setUp(self) -> None:
        self.distances = MockDistances()
        self.drives = MockDrives()
        self.drivers = MockDrivers()
        self.customers = MockCustomers()
        self.notifications = MockNotifications()
        self.payments = MockPayments()
        self.blockchain = MockBlockChain()
        self.finish_drive = FinishDrive(self.drives,
                                        self.drivers,
                                        self.distances,
                                        self.customers,
                                        self.notifications,
                                        self.payments,
                                        self.blockchain)

        self.driver = Driver(driver_id='driver',
                             name='Alex',
                             available=Availability.UNAVAILABLE)
        self.drivers.drivers[self.driver.id] = self.driver

        self.customer = Customer(customer_id='customer',
                                 name='Pierre',
                                 drive_status=CustomerDriveStatus.ACTIVE,
                                 device_token='drive_finished_customer')
        self.customers.customers[self.customer.id] = self.customer

        self.drive = Drive(drive_id='drive',
                           driver=self.driver,
                           customer=self.customer,
                           state=picked_up_state,
                           picked_up_time=datetime.now(),
                           price_estimate=100)
        self.drives.drives[self.drive.id] = self.drive

    def test_drive_is_finished(self):
        self.finish_drive.handle(self.drive.id,
                                 self.driver.id)

        updated_drive = self.drives.drives[self.drive.id]

        self.assertIsNotNone(updated_drive.end_time)
        self.assertIsNotNone(updated_drive.actual_price)
        self.assertEqual(finished_state, updated_drive.state)

        updated_driver = self.drivers.drivers[self.driver.id]

        self.assertEqual(Availability.AVAILABLE, updated_driver.available)

        updated_customer = self.customers.customers[self.customer.id]

        self.assertEqual(CustomerDriveStatus.INACTIVE, updated_customer.drive_status)
        self.assertIn(dict(to=updated_customer.device_token,
                           message=Notification(type_=NotificationType.DRIVE_FINISHED,
                                                title='Drive finished',
                                                body='Drive is finished').to_dict()),
                      self.notifications.notifications)

    def test_driver_did_not_order_drive(self):
        driver = Driver(driver_id='different')
        self.drivers.drivers[driver.id] = driver

        with self.assertRaises(DriverDidNotAcceptDriveError):
            self.finish_drive.handle(self.drive.id,
                                     driver.id)

    def test_customer_is_not_picked_up(self):
        self.drives.drives[self.drive.id].change_state(finished_state)

        with self.assertRaises(CustomerIsNotPickedUpError):
            self.finish_drive.handle(self.drive.id,
                                     self.driver.id)
