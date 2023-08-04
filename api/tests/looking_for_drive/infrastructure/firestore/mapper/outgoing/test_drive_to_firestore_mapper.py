import unittest

from src.looking_for_drive.core.model.customer.customer import Customer
from src.looking_for_drive.core.model.drive.drive import Drive
from src.looking_for_drive.core.model.driver.driver import Driver
from src.looking_for_drive.infrastructure.firestore.mapper.outgoing.drive_to_firestore_mapper import DriveToFirestoreMapper
from tests.common.infrastructure.firestore.firestore import mock_db


class TestDriveToFirestoreMapper(unittest.TestCase):

    def setUp(self) -> None:
        self.__db = mock_db

        customer = Customer(customer_id='customer')
        driver = Driver(driver_id='driver')
        self.drive = Drive(customer=customer,
                           driver=driver)
        self.drive_to_firestore_mapper = DriveToFirestoreMapper(self.__db)

    def test_customer_is_mapped_to_ref(self):
        self.drive.driver = None

        mapped_drive = self.drive_to_firestore_mapper.map_for_firestore(self.drive)

        self.assertEqual('DocumentReference', type(mapped_drive['customer']).__name__)

    def test_driver_is_mapped_to_ref(self):
        self.drive.customer = None

        mapped_drive = self.drive_to_firestore_mapper.map_for_firestore(self.drive)

        self.assertEqual('DocumentReference', type(mapped_drive['driver']).__name__)

    def test_customer_is_not_mapped(self):
        self.drive.customer = None

        mapped_drive = self.drive_to_firestore_mapper.map_for_firestore(self.drive)

        self.assertIsNone(mapped_drive['customer'])

    def test_driver_is_not_mapped(self):
        self.drive.driver = None

        mapped_drive = self.drive_to_firestore_mapper.map_for_firestore(self.drive)

        self.assertIsNone(mapped_drive['driver'])
