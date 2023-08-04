import unittest

from src.config.firestore.firestore_collections_names import FirestoreCollectionNames
from src.looking_for_drive.core.model.driver.availability import Availability
from src.looking_for_drive.core.model.driver.driver import Driver
from src.looking_for_drive.infrastructure.firestore.adapter.firestore_drivers import FirestoreDrivers
from src.looking_for_drive.infrastructure.firestore.error.driver_not_found_error import DriverNotFoundError
from src.looking_for_drive.infrastructure.firestore.mapper.outgoing.driver_to_firestore_mapper import \
    DriverToFirestoreMapper
from tests.common.infrastructure.firestore.firestore import mock_db


class TestFirestoreDrivers(unittest.TestCase):

    def setUp(self) -> None:
        self.__db = mock_db
        self.firestore_drivers = FirestoreDrivers(self.__db)

        self.saved_driver = Driver(name="Test",
                                   available=Availability.AVAILABLE,
                                   device_token='test_token')
        _, self.saved_driver_ref = self.__db.collection(FirestoreCollectionNames.USER.value)\
            .add(DriverToFirestoreMapper.map_for_firestore(self.saved_driver))

    def test_get_driver_with_id(self):
        driver = self.firestore_drivers.find_by_id(self.saved_driver_ref.id)

        self.assertEqual(self.saved_driver.to_dict(), driver.to_dict())
        self.assertEqual(self.saved_driver_ref.id, driver.id)

    def test_driver_not_found(self):
        with self.assertRaises(DriverNotFoundError):
            self.firestore_drivers.find_by_id('not_found')

    def test_driver_updated(self):
        driver_to_update = Driver(driver_id=self.saved_driver_ref.id,
                                  name="Alex",
                                  available=Availability.UNAVAILABLE,
                                  device_token='alex_token')

        self.firestore_drivers.update(driver_to_update)

        driver_updated = self.firestore_drivers.find_by_id(driver_to_update.id)

        self.assertEqual(driver_to_update, driver_updated)



