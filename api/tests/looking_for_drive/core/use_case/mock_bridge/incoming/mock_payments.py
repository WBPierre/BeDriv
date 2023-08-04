from src.looking_for_drive.core.bridge.incoming.payments import Payments


class MockPayments(Payments):
    OK = 'ok'

    def create_payment_intent(self, amount: float) -> str:
        return self.OK

    def confirm_payment(self,
                        payment_intent_id: str):
        pass
