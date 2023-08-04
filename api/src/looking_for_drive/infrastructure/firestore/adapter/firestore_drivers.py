from google.cloud import firestore

from src.config.firestore.firestore_collections_names import FirestoreCollectionNames
from src.looking_for_drive.core.bridge.incoming.drivers import Drivers
from src.looking_for_drive.core.model.driver.driver import Driver
from src.looking_for_drive.infrastructure.firestore.error.driver_not_found_error import DriverNotFoundError
from src.looking_for_drive.infrastructure.firestore.mapper.incoming.driver_mapper import driver_mapper
from src.looking_for_drive.infrastructure.firestore.mapper.outgoing.driver_to_firestore_mapper import \
    DriverToFirestoreMapper


class FirestoreDrivers(Drivers):

    def __init__(self,
                 db: firestore.Client):
        self.__db = db

    def find_by_id(self,
                   driver_id: str) -> Driver:
        driver = self.__db.collection(FirestoreCollectionNames.USER.value).document(driver_id).get()
        driver_dict = driver.to_dict()
        if not driver_dict:
            raise DriverNotFoundError
        driver = driver_mapper(driver_id,
                               driver_dict)
        return driver

    def update(self,
               driver: Driver) -> Driver:
        driver_to_update = DriverToFirestoreMapper.map_for_firestore(driver)
        self.__db.collection(FirestoreCollectionNames.USER.value).document(driver.id).set(driver_to_update, merge=True)
        return driver
