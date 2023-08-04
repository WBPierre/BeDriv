from src.looking_for_drive.core.bridge.incoming.customers import Customers
from src.looking_for_drive.core.model.customer.customer import Customer
from src.looking_for_drive.core.model.customer.customer_drive_status import CustomerDriveStatus


class MockCustomers(Customers):

    def __init__(self):
        self.customers = dict()

        order_drive_customer = Customer('a', 'Alex', CustomerDriveStatus.INACTIVE)
        self.customers[order_drive_customer.id] = order_drive_customer

        customer_has_drive_in_progress = Customer('b', 'Pierre', CustomerDriveStatus.ACTIVE)
        self.customers[customer_has_drive_in_progress.id] = customer_has_drive_in_progress

    def find_by_id(self, customer_id: str) -> Customer:
        return self.customers[customer_id]

    def update(self, customer: Customer) -> Customer:
        self.customers[customer.id] = customer
        return customer
