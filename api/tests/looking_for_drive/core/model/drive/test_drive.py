import unittest
import copy

from src.looking_for_drive.core.model.customer.customer import Customer
from src.looking_for_drive.core.model.customer.customer_drive_status import CustomerDriveStatus
from src.looking_for_drive.core.model.drive.drive import Drive
from src.looking_for_drive.core.model.drive.location import Location
from src.looking_for_drive.core.model.driver.driver import Driver


class TestDrive(unittest.TestCase):

    def setUp(self) -> None:
        self.drive = Drive()
        self.expected_output = copy.copy(self.drive.__dict__)
        self.expected_output.pop('_Drive__id')
        self.expected_output.pop('_Drive__state')
        self.expected_output['state'] = 'waiting'

    def test_drive_should_not_convert_customer_or_driver(self):
        output = self.drive.to_dict()

        self.assertEqual(self.expected_output, output)

    def test_drive_should_convert_customer_to_id(self):
        customer = Customer(customer_id="a")
        self.drive.customer = customer

        self.expected_output["customer"] = 'a'

        output = self.drive.to_dict()

        self.assertEqual(self.expected_output, output)

    def test_drive_should_convert_driver_to_id(self):
        driver = Driver("a")
        self.drive.driver = driver

        self.expected_output['driver'] = 'a'

        output = self.drive.to_dict()

        self.assertEqual(self.expected_output, output)

    def test_drive_should_convert_driver_and_customer_to_id(self):
        driver = Driver("a")
        customer = Customer("b")
        self.drive.driver = driver
        self.drive.customer = customer

        self.expected_output['driver'] = 'a'
        self.expected_output['customer'] = 'b'

        output = self.drive.to_dict()

        self.assertEqual(self.expected_output, output)

    def test_drive_should_convert_start(self):
        start = Location(1, 1)
        self.drive.start_location = start

        self.expected_output['start_location'] = start.__dict__

        output = self.drive.to_dict()

        self.assertEqual(self.expected_output, output)

    def test_drive_should_convert_destination(self):
        destination = Location(1, 1)
        self.drive.destination = destination

        self.expected_output['destination'] = destination.__dict__

        output = self.drive.to_dict()

        self.assertEqual(self.expected_output, output)
