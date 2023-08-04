from typing import Dict

from src.looking_for_drive.core.model.customer.customer import Customer
from src.looking_for_drive.core.model.customer.customer_drive_status import CustomerDriveStatus


def customer_mapper(customer_id: str, customer: Dict) -> Customer:
    drive_status = CustomerDriveStatus.INACTIVE if not customer['drive_status'] else CustomerDriveStatus.ACTIVE
    customer = Customer(customer_id=customer_id,
                        name=customer['given_name'],
                        drive_status=drive_status,
                        device_token=customer['device_token'],
                        drive_in_progress=customer.get('drive_in_progress', None),
                        stripe_id=customer['stripe_id'],
                        balance=customer.get('balance', .0),
                        public_key=customer.get('public_key', None))
    return customer
