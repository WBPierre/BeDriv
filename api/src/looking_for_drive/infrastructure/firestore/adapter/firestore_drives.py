from google.cloud import firestore

from src.config.firestore.firestore_collections_names import FirestoreCollectionNames
from src.looking_for_drive.core.bridge.incoming.drives import Drives
from src.looking_for_drive.core.model.drive.drive import Drive
from src.looking_for_drive.infrastructure.firestore.error.drive_not_found_error import DriveNotFoundError
from src.looking_for_drive.infrastructure.firestore.mapper.incoming.drive_mapper import DriveMapper
from src.looking_for_drive.infrastructure.firestore.mapper.outgoing.drive_to_firestore_mapper import DriveToFirestoreMapper


class FirestoreDrives(Drives):

    def __init__(self, db: firestore.Client):
        self.__db = db
        self.drive_to_firestore_mapper = DriveToFirestoreMapper(self.__db)

    def save(self,
             drive: Drive) -> str:
        drive_to_save = self.drive_to_firestore_mapper.map_for_firestore(drive)
        _, saved_drive_ref = self.__db.collection(FirestoreCollectionNames.DRIVE.value).add(drive_to_save)
        return saved_drive_ref.id

    def find_by_id(self, drive_id: str) -> Drive:
        drive = self.__db.collection(FirestoreCollectionNames.DRIVE.value).document(drive_id).get()
        drive_dict = drive.to_dict()
        if not drive_dict:
            raise DriveNotFoundError
        drive = DriveMapper.create_drive_from_firestore(drive_id,
                                                        drive_dict)
        return drive

    def update(self, drive: Drive) -> Drive:
        drive_to_update = self.drive_to_firestore_mapper.map_for_firestore(drive)
        self.__db.collection(FirestoreCollectionNames.DRIVE.value).document(drive.id).set(drive_to_update, merge=True)
        return drive

    def get_declined_drivers(self,
                             drive_id: str) -> list:
        drive = self.__db.collection(FirestoreCollectionNames.DRIVE.value).document(drive_id).get().to_dict()
        return drive.get('declined_drivers', [])

    def update_declined_drivers(self,
                                drive_id: str,
                                driver_ids_list: list) -> None:
        self.__db.collection(FirestoreCollectionNames.DRIVE.value).document(drive_id).set({
            'declined_drivers': driver_ids_list
        }, merge=True)
