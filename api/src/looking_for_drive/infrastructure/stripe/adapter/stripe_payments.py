from __future__ import annotations
from typing import TYPE_CHECKING

import os
import math

import stripe

from src.looking_for_drive.core.bridge.incoming.payments import Payments

if TYPE_CHECKING:
    from src.looking_for_drive.core.model.customer.payment_info import PaymentInfo

stripe.api_key = os.environ.get('STRIPE_API_KEY')


class StripePayments(Payments):

    def create_payment_intent(self, payment_info: PaymentInfo) -> str:
        intent = stripe.PaymentIntent.create(amount=math.floor(payment_info.estimated_price * 100),
                                             currency='eur',
                                             customer=payment_info.stripe_customer_id,
                                             payment_method=payment_info.payment_method_id,
                                             confirmation_method='manual')
        return intent['id']

    def confirm_payment(self,
                        payment_intent_id: str):
        stripe.PaymentIntent.confirm(payment_intent_id)
