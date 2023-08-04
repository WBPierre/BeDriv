from __future__ import annotations
from typing import TYPE_CHECKING

from flask.views import MethodView

from src.common.application.flask.error.invalid_usage import InvalidUsage
from src.looking_for_drive.infrastructure.firestore.error.customer_not_found_error import CustomerNotFoundError

if TYPE_CHECKING:
    from src.looking_for_drive.core.bridge.incoming.blockchain import BlockChain
    from src.looking_for_drive.core.bridge.incoming.customers import Customers
from src.looking_for_drive.core.use_case.customer.transfer_balance import TransferBalance


class TransferBalanceRoute(MethodView):

    def __init__(self,
                 customers: Customers,
                 blockchain: BlockChain):
        self.transfer_balance = TransferBalance(customers,
                                                blockchain)

    def put(self,
            customer_id: str):
        try:
            self.transfer_balance.handle(customer_id)
        except CustomerNotFoundError:
            raise InvalidUsage('Customer not found',
                               status_code=404)
        return dict(message='Balance transferred'), 200
