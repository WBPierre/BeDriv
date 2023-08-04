import unittest

from src.config.firestore.firestore_collections_names import FirestoreCollectionNames
from src.looking_for_drive.core.model.customer.customer import Customer
from src.looking_for_drive.core.model.customer.customer_drive_status import CustomerDriveStatus
from src.looking_for_drive.infrastructure.firestore.adapter.firestore_customers import FirestoreCustomers
from src.looking_for_drive.infrastructure.firestore.error.customer_not_found_error import CustomerNotFoundError
from tests.common.infrastructure.firestore.firestore import mock_db


class TestFirestoreCustomers(unittest.TestCase):

    def setUp(self) -> None:
        self.__db = mock_db
        self.firestore_customers = FirestoreCustomers(self.__db)

        self.saved_customer = Customer(name="Test", drive_status=CustomerDriveStatus.INACTIVE)
        _, self.saved_customer_ref = self.__db.collection(FirestoreCollectionNames.USER.value)\
            .add(self.saved_customer.to_dict())

    def test_get_customer_with_id(self):
        saved_customer = self.firestore_customers.find_by_id(self.saved_customer_ref.id)

        self.assertEqual(self.saved_customer.to_dict(), saved_customer.to_dict())
        self.assertEqual(self.saved_customer_ref.id, saved_customer.id)

    def test_customer_not_found(self):
        with self.assertRaises(CustomerNotFoundError):
            self.firestore_customers.find_by_id('not_found')

    def test_update_customer(self):
        customer_to_update = Customer(customer_id=self.saved_customer_ref.id,
                                      name="Alex",
                                      drive_status=CustomerDriveStatus.ACTIVE)

        self.firestore_customers.update(customer_to_update)

        customer_saved = self.firestore_customers.find_by_id(self.saved_customer_ref.id)

        self.assertEqual(customer_to_update, customer_saved)
