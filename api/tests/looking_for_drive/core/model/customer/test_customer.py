import unittest

from src.looking_for_drive.core.model.customer.customer import Customer
from src.looking_for_drive.core.model.customer.customer_drive_status import CustomerDriveStatus


class TestCustomer(unittest.TestCase):

    def test_customer_drive_status_should_be_converted_to_true_when_active(self):
        active_customer = Customer(drive_status=CustomerDriveStatus.ACTIVE)

        expected_output = dict(given_name=active_customer.name,
                               drive_status=True,
                               device_token=None,
                               drive_in_progress=None,
                               stripe_id=None,
                               public_key=None,
                               balance=.0)

        self.assertEqual(expected_output, active_customer.to_dict())
    
    def test_customer_drive_status_should_be_converted_to_false_when_inactive(self):
        inactive_customer = Customer(drive_status=CustomerDriveStatus.INACTIVE)

        expected_output = dict(given_name=inactive_customer.name,
                               drive_status=False,
                               device_token=None,
                               drive_in_progress=None,
                               stripe_id=None,
                               public_key=None,
                               balance=.0)

        self.assertEqual(expected_output, inactive_customer.to_dict())
