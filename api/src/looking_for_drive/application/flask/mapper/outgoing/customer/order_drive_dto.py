from __future__ import annotations
from typing import Dict, TYPE_CHECKING

if TYPE_CHECKING:
    from src.looking_for_drive.core.model.drive.drive import Drive


class OrderDriveDTO:

    def __init__(self,
                 drive_id: str,
                 customer_id: str,
                 state: str,
                 client_secret: str):
        self.drive_id = drive_id
        self.customer_id = customer_id
        self.state = state
        self.client_secret = client_secret

    def to_dict(self) -> Dict:
        order_drive_dto_dict = dict(drive_id=self.drive_id,
                                    customer_id=self.customer_id,
                                    state=self.state,
                                    client_secret=self.client_secret)
        return order_drive_dto_dict

    @classmethod
    def create_from_drive(cls,
                          drive: Drive,
                          drive_id: str,
                          client_secret: str) -> OrderDriveDTO:
        order_drive_dto = cls(drive_id=drive_id,
                              customer_id=drive.customer.id,
                              state=drive.state.name,
                              client_secret=client_secret)
        return order_drive_dto
