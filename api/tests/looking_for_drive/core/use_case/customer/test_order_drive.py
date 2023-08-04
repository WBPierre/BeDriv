import unittest
from datetime import datetime

from src.looking_for_drive.core.model.customer.payment_info import PaymentInfo
from src.looking_for_drive.core.model.drive.drive import Drive
from src.looking_for_drive.core.model.drive.location import Location
from src.looking_for_drive.core.model.error.customer.order_drive.customer_has_drive_in_progress_error import CustomerHasDriveInProgressError
from src.looking_for_drive.core.model.error.customer.order_drive.same_start_and_destination_error import SameStartAndDestinationError
from src.looking_for_drive.core.use_case.customer.order_drive import OrderDrive
from tests.looking_for_drive.core.use_case.mock_bridge.incoming.mock_customers import MockCustomers
from tests.looking_for_drive.core.use_case.mock_bridge.incoming.mock_drives import MockDrives
from tests.looking_for_drive.core.use_case.mock_bridge.incoming.mock_payments import MockPayments
from tests.looking_for_drive.core.use_case.mock_bridge.incoming.mock_publisher import MockPublisher


class TestOrderDrive(unittest.TestCase):

    def setUp(self) -> None:
        self.fake_customers = MockCustomers()
        self.fake_drives = MockDrives()
        self.fake_publisher = MockPublisher()
        self.fake_payments = MockPayments()
        self.order_drive = OrderDrive(self.fake_customers,
                                      self.fake_drives,
                                      self.fake_publisher,
                                      self.fake_payments)
        self.start = Location(.1, .1)
        self.destination = Location(.2, .2)
        self.payment_info = PaymentInfo(estimated_price=1,
                                        stripe_customer_id='stripe',
                                        payment_method_id='payment')

    def test_order_is_created(self):
        customer_id = 'a'
        current_time = datetime.now()

        drive_id, drive_order, client_secret = self.order_drive.handle(self.start,
                                                                       self.destination,
                                                                       customer_id,
                                                                       self.payment_info)
        drive_order.start_time = current_time
        customer = self.fake_customers.find_by_id(customer_id)
        expected_drive = Drive(start_location=self.start,
                               destination=self.destination,
                               customer=customer,
                               price_estimate=self.payment_info.estimated_price,
                               start_time=current_time,
                               payment_intent_id=MockPayments.OK)

        self.assertEqual(expected_drive, drive_order)
        self.assertIn(drive_order, self.fake_drives.drives.values())
        self.assertIn(drive_order.customer, self.fake_customers.customers.values())
        self.assertIn(expected_drive, self.fake_publisher.topics)
        self.assertEqual(MockPayments.OK, client_secret)

    def test_customer_has_drive_in_progress(self):
        customer_id = 'b'

        with self.assertRaises(CustomerHasDriveInProgressError):
            self.order_drive.handle(self.start,
                                    self.destination,
                                    customer_id,
                                    self.payment_info)

    def test_same_start_and_destination(self):
        customer_id = 'a'

        with self.assertRaises(SameStartAndDestinationError):
            self.order_drive.handle(self.start,
                                    self.start,
                                    customer_id,
                                    self.payment_info)
