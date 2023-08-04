from __future__ import annotations
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from src.looking_for_drive.core.model.customer.payment_info import PaymentInfo


class Payments:

    def create_payment_intent(self, payment_info: PaymentInfo) -> str:
        raise NotImplementedError

    def confirm_payment(self,
                        payment_intent_id: str):
        raise NotImplementedError
