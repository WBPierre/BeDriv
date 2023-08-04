from __future__ import annotations
from typing import TYPE_CHECKING

from src.config.firestore.firestore_collections_names import FirestoreCollectionNames

if TYPE_CHECKING:
    from google.cloud import firestore

    from src.looking_for_drive.core.model.customer.customer import Customer


class CustomerToFirestoreMapper:

    def __init__(self,
                 db: firestore.Client):
        self.__db = db

    def map_for_firestore(self,
                          customer: Customer) -> dict:
        customer_dict = customer.to_dict()
        if customer_dict['drive_in_progress']:
            customer_dict['drive_in_progress'] = self.__db.collection(FirestoreCollectionNames.DRIVE.value)\
                .document(customer_dict['drive_in_progress'])
        return customer_dict
