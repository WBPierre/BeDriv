from __future__ import annotations
from typing import Dict

from src.common.core.model.custom_object_equals import CustomObjectEquals
from src.looking_for_drive.core.model.customer.customer_drive_status import CustomerDriveStatus
from src.looking_for_drive.core.model.error.customer.customer_did_not_order_drive_error import \
    CustomerDidNotOrderDriveError
from src.looking_for_drive.core.model.error.customer.order_drive.customer_has_drive_in_progress_error import \
    CustomerHasDriveInProgressError


class Customer(CustomObjectEquals):

    def __init__(self,
                 customer_id: str = None,
                 name: str = None,
                 drive_status: CustomerDriveStatus = None,
                 device_token: str = None,
                 drive_in_progress: str = None,
                 stripe_id: str = None,
                 balance: float = .0,
                 public_key: str = None) -> None:
        self.__id = customer_id
        self.name = name
        self.drive_status = drive_status
        self.device_token = device_token
        self.drive_in_progress = drive_in_progress
        self.stripe_id = stripe_id
        self.balance = balance
        self.public_key = public_key

    @property
    def id(self) -> str:
        return self.__id

    def to_dict(self) -> Dict:
        customer_dict = dict(given_name=self.name,
                             drive_status=True if self.drive_status == CustomerDriveStatus.ACTIVE else False,
                             device_token=self.device_token,
                             drive_in_progress=self.drive_in_progress,
                             stripe_id=self.stripe_id,
                             balance=self.balance,
                             public_key=self.public_key)
        return customer_dict

    def is_inactive(self):
        if self.drive_status == CustomerDriveStatus.ACTIVE:
            raise CustomerHasDriveInProgressError

    def is_the_same(self,
                    customer_id: str):
        if self.__id != customer_id:
            raise CustomerDidNotOrderDriveError

    @classmethod
    def toggle_drive_status(cls,
                            customer: Customer,
                            drive_status: CustomerDriveStatus) -> Customer:
        customer = cls(customer_id=customer.id,
                       name=customer.name,
                       drive_status=drive_status,
                       device_token=customer.device_token,
                       stripe_id=customer.stripe_id,
                       balance=customer.balance,
                       public_key=customer.public_key)
        return customer

    def remove_drive_in_progress(self):
        self.drive_in_progress = None

    def pay(self, amount: float) -> float:
        cashback = amount * .08
        if self.public_key is None:
            self.balance += cashback
        return cashback * (10 ** 6)

    def transfer_balance(self) -> float:
        balance = self.balance
        self.balance = 0
        return balance
