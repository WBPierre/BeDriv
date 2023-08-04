from __future__ import annotations
from typing import Tuple, TYPE_CHECKING

from src.looking_for_drive.core.model.drive .drive import Drive

if TYPE_CHECKING:
    from src.looking_for_drive.core.bridge.incoming.customers import Customers
    from src.looking_for_drive.core.bridge.incoming.drives import Drives
    from src.looking_for_drive.core.model.drive.location import Location
    from src.looking_for_drive.core.bridge.incoming.publisher import Publisher
    from src.looking_for_drive.core.bridge.incoming.payments import Payments
    from src.looking_for_drive.core.model.customer.payment_info import PaymentInfo


class OrderDrive:

    def __init__(self,
                 customers: Customers,
                 drivers: Drives,
                 publisher: Publisher,
                 payments: Payments):
        self.customers = customers
        self.drivers = drivers
        self.publisher = publisher
        self.payments = payments

    def handle(self,
               start: Location,
               destination: Location,
               customer_id: str,
               payment_info: PaymentInfo) -> Tuple[str, Drive, str]:
        customer = self.customers.find_by_id(customer_id)

        drive = Drive(customer=customer,
                      start_location=start,
                      destination=destination,
                      price_estimate=payment_info.estimated_price)

        drive.check_customer_is_inactive()
        drive.check_start_is_different_from_destination()
        drive.make_customer_active()
        payment_info.stripe_customer_id = customer.stripe_id

        client_secret = self.payments.create_payment_intent(payment_info)
        drive.payment_intent_id = client_secret

        drive_id = self.drivers.save(drive)

        drive.add_drive_in_progress(drive_id)
        self.customers.update(drive.customer)
        self.publisher.publish_location(drive, drive_id)

        return drive_id, drive, client_secret
