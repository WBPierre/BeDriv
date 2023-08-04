from src.looking_for_drive.core.model.customer.customer import Customer


class Customers:

    def find_by_id(self, customer_id: str) -> Customer:
        raise NotImplementedError

    def update(self, customer: Customer) -> Customer:
        raise NotImplementedError
