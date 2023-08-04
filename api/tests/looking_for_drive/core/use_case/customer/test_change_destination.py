import unittest

from src.looking_for_drive.core.model.customer.customer import Customer
from src.looking_for_drive.core.model.drive.drive import Drive
from src.looking_for_drive.core.model.drive.drive_state import accepted_state, picked_up_state, cancelled_state
from src.looking_for_drive.core.model.drive.location import Location
from src.looking_for_drive.core.model.drive.pricing import Pricing
from src.looking_for_drive.core.model.error.customer.change_destination.destination_cannot_be_changed_error import \
    DestinationCannotBeChangedError
from src.looking_for_drive.core.model.error.customer.customer_did_not_order_drive_error import \
    CustomerDidNotOrderDriveError
from src.looking_for_drive.core.use_case.customer.change_destination import ChangeDestination
from tests.looking_for_drive.core.use_case.mock_bridge.incoming.mock_customers import MockCustomers
from tests.looking_for_drive.core.use_case.mock_bridge.incoming.mock_distances import MockDistances
from tests.looking_for_drive.core.use_case.mock_bridge.incoming.mock_drives import MockDrives


class TestChangeDestination(unittest.TestCase):

    def setUp(self) -> None:
        self.drives = MockDrives()
        self.distances = MockDistances()
        self.customers = MockCustomers()
        self.change_destination = ChangeDestination(self.drives,
                                                    self.distances)

        self.customer = Customer(customer_id='customer')
        self.customers.customers[self.customer.id] = self.customer

        self.drive = Drive(drive_id='drive',
                           customer=self.customer)
        self.drives.drives[self.drive.id] = self.drive

        self.new_destination = Location(latitude=1,
                                        longitude=2)

    def destination_has_changed(self):
        duration, _ = self.change_destination.handle(self.drive.id,
                                                     self.customer.id,
                                                     self.new_destination)

        updated_drive = self.drives.drives[self.drive.id]
        expected_estimated_price = Pricing.base() + Pricing.per_km() + Pricing.per_minute()

        self.assertEqual(expected_estimated_price, updated_drive.price_estimate)
        self.assertEqual(self.new_destination, updated_drive.destination)
        self.assertEqual(self.distances.DURATION, duration)

    def test_destination_changed_in_waiting_state(self):
        self.change_destination.handle(self.drive.id,
                                       self.customer.id,
                                       self.new_destination)

        self.destination_has_changed()

    def test_destination_changed_in_accepted_state(self):
        self.drive.change_state(accepted_state)
        self.drives.drives[self.drive.id] = self.drive

        self.change_destination.handle(self.drive.id,
                                       self.customer.id,
                                       self.new_destination)

        self.destination_has_changed()

    def test_destination_changed_in_picked_up_state(self):
        self.drive.change_state(picked_up_state)
        self.drives.drives[self.drive.id] = self.drive

        self.change_destination.handle(self.drive.id,
                                       self.customer.id,
                                       self.new_destination)

        self.destination_has_changed()

    def test_destination_cannot_be_changed_in_other_state(self):
        self.drive.change_state(cancelled_state)
        self.drives.drives[self.drive.id] = self.drive

        with self.assertRaises(DestinationCannotBeChangedError):
            self.change_destination.handle(self.drive.id,
                                           self.customer.id,
                                           self.new_destination)

    def test_customer_did_not_order_drive(self):
        customer = Customer(customer_id='different_customer')
        self.customers.customers[customer.id] = customer

        with self.assertRaises(CustomerDidNotOrderDriveError):
            self.change_destination.handle(self.drive.id,
                                           customer.id,
                                           self.new_destination)
