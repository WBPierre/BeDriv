from __future__ import annotations
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from src.looking_for_drive.core.bridge.incoming.blockchain import BlockChain
    from src.looking_for_drive.core.bridge.incoming.customers import Customers


class TransferBalance:

    def __init__(self,
                 customers: Customers,
                 blockchain: BlockChain):
        self.customers = customers
        self.blockchain = blockchain

    def handle(self,
               customer_id: str):
        customer = self.customers.find_by_id(customer_id)

        balance = customer.transfer_balance()

        self.blockchain.get_cashback(customer.public_key,
                                     balance)
        self.customers.update(customer)
