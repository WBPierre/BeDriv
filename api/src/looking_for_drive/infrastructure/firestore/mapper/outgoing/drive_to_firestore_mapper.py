from typing import Dict

from google.cloud import firestore

from src.config.firestore.firestore_collections_names import FirestoreCollectionNames
from src.looking_for_drive.core.model.drive.drive import Drive


class DriveToFirestoreMapper:

    def __init__(self,
                 db: firestore.Client) -> None:
        self.db = db

    def map_for_firestore(self,
                          drive: Drive) -> Dict:
        drive_dict = drive.to_dict()
        if drive_dict['customer']:
            drive_dict['customer'] = self.db.collection(FirestoreCollectionNames.USER.value)\
                .document(drive_dict['customer'])
        if drive_dict['driver']:
            drive_dict['driver'] = self.db.collection(FirestoreCollectionNames.USER.value).document(drive_dict['driver'])
        return drive_dict
