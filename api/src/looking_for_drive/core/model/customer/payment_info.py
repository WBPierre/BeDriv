class PaymentInfo:

    def __init__(self,
                 estimated_price: float = None,
                 stripe_customer_id: str = None,
                 payment_method_id: str = None):
        self.estimated_price = estimated_price
        self.stripe_customer_id = stripe_customer_id
        self.payment_method_id = payment_method_id
