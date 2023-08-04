import unittest

from src.config.firestore.firestore_collections_names import FirestoreCollectionNames
from src.looking_for_drive.core.model.customer.customer import Customer
from src.looking_for_drive.core.model.customer.customer_drive_status import CustomerDriveStatus
from src.looking_for_drive.core.model.drive.drive import Drive
from src.looking_for_drive.core.model.drive.drive_state import waiting_state
from src.looking_for_drive.core.model.drive.location import Location
from src.looking_for_drive.core.model.driver.availability import Availability
from src.looking_for_drive.core.model.driver.driver import Driver
from src.looking_for_drive.infrastructure.firestore.adapter.firestore_drives import FirestoreDrives
from src.looking_for_drive.infrastructure.firestore.error.drive_not_found_error import DriveNotFoundError
from src.looking_for_drive.infrastructure.firestore.mapper.outgoing.drive_to_firestore_mapper \
    import DriveToFirestoreMapper
from src.looking_for_drive.infrastructure.firestore.mapper.outgoing.driver_to_firestore_mapper import \
    DriverToFirestoreMapper
from tests.common.infrastructure.firestore.firestore import mock_db


class TestFirestoreDrives(unittest.TestCase):

    def setUp(self) -> None:
        self.__db = mock_db
        self.firestore_drives = FirestoreDrives(self.__db)
        self.drive_to_firestore_mapper = DriveToFirestoreMapper(self.__db)

        self.customer_id = 'customer'
        self.customer = Customer(customer_id=self.customer_id,
                                 name='Alex',
                                 drive_status=CustomerDriveStatus.ACTIVE)
        self.__db.collection(FirestoreCollectionNames.USER.value).document(self.customer_id)\
            .set(self.customer.to_dict())

        self.driver_id = 'driver'
        self.driver = Driver(driver_id=self.driver_id,
                             name='Pierre',
                             available=Availability.UNAVAILABLE)
        self.__db.collection(FirestoreCollectionNames.USER.value).document(self.driver_id)\
            .set(DriverToFirestoreMapper.map_for_firestore(self.driver))

        self.drive_id = 'driver'
        start = Location(latitude=1,
                         longitude=2)
        destination = Location(latitude=3,
                               longitude=4)
        self.drive = Drive(drive_id=self.drive_id,
                           customer=self.customer,
                           driver=self.driver,
                           start_location=start,
                           destination=destination)
        self.__db.collection(FirestoreCollectionNames.DRIVE.value).document(self.drive_id)\
            .set(self.drive_to_firestore_mapper.map_for_firestore(self.drive))

    def test_drive_is_saved(self):
        drive_to_save = Drive()

        drive_saved_id = self.firestore_drives.save(drive_to_save)

        drive_saved = self.__db.collection(FirestoreCollectionNames.DRIVE.value)\
            .document(drive_saved_id).get().to_dict()

        expected_output = self.drive_to_firestore_mapper.map_for_firestore(drive_to_save)
        self.assertEqual(expected_output, drive_saved)

    def test_get_drive_with_id(self):
        drive = self.firestore_drives.find_by_id(self.drive_id)

        self.assertEqual(self.drive, drive)

    def test_drive_not_found(self):
        with self.assertRaises(DriveNotFoundError):
            self.firestore_drives.find_by_id('not_found')

    def test_drive_is_updated(self):
        self.drive.price_estimate = 10

        self.firestore_drives.update(self.drive)
        drive_updated = self.firestore_drives.find_by_id(self.drive.id)

        self.assertEqual(self.drive, drive_updated)
