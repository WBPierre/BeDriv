from google.cloud import firestore

from src.config.firestore.firestore_collections_names import FirestoreCollectionNames
from src.looking_for_drive.core.bridge.incoming.customers import Customers
from src.looking_for_drive.core.model.customer.customer import Customer
from src.looking_for_drive.infrastructure.firestore.error.customer_not_found_error import CustomerNotFoundError
from src.looking_for_drive.infrastructure.firestore.mapper.incoming.customer_mapper import customer_mapper
from src.looking_for_drive.infrastructure.firestore.mapper.outgoing.customer_to_firestore_mapper import \
    CustomerToFirestoreMapper


class FirestoreCustomers(Customers):

    def __init__(self, db: firestore.Client):
        self.__db = db
        self.customer_to_firestore_mapper = CustomerToFirestoreMapper(self.__db)

    def find_by_id(self, customer_id: str) -> Customer:
        user = self.__db.collection(FirestoreCollectionNames.USER.value)\
            .document(customer_id).get()
        user_dict = user.to_dict()
        if not user_dict:
            raise CustomerNotFoundError
        customer = customer_mapper(customer_id, user_dict)
        return customer

    def update(self, customer: Customer) -> Customer:
        self.__db.collection(FirestoreCollectionNames.USER.value)\
            .document(customer.id).set(self.customer_to_firestore_mapper.map_for_firestore(customer), merge=True)
        return customer
