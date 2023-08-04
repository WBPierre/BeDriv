from __future__ import annotations
from typing import TYPE_CHECKING

from src.looking_for_drive.core.bridge.incoming.blockchain import BlockChain
from src.looking_for_drive.core.model.notification.notification import Notification
from src.looking_for_drive.core.model.notification.notification_type import NotificationType

if TYPE_CHECKING:
    from src.looking_for_drive.core.bridge.incoming.customers import Customers
    from src.looking_for_drive.core.bridge.incoming.distances import Distances
    from src.looking_for_drive.core.bridge.incoming.drivers import Drivers
    from src.looking_for_drive.core.bridge.incoming.drives import Drives
    from src.looking_for_drive.core.model.drive.drive import Drive
    from src.looking_for_drive.core.bridge.incoming.notifications import Notifications
    from src.looking_for_drive.core.bridge.incoming.payments import Payments


class FinishDrive:

    def __init__(self,
                 drives: Drives,
                 drivers: Drivers,
                 distances: Distances,
                 customers: Customers,
                 notifications: Notifications,
                 payments: Payments,
                 blockchain: BlockChain):
        self.drives = drives
        self.drivers = drivers
        self.distances = distances
        self.customers = customers
        self.notifications = notifications
        self.payments = payments
        self.blockchain = blockchain

    def handle(self,
               drive_id: str,
               driver_id: str) -> Drive:
        drive = self.drives.find_by_id(drive_id)
        distance, _ = self.distances.get_distance_and_duration(drive.start_location,
                                                               drive.destination)

        drive.finish_drive(driver_id,
                           distance)
        cashback = drive.customer.pay(drive.price_estimate)

        if drive.customer.public_key:
            self.blockchain.get_cashback(drive.customer.public_key,
                                         cashback)
        self.payments.confirm_payment(drive.payment_intent_id)
        self.drives.update(drive)
        self.drivers.update(drive.driver)
        self.customers.update(drive.customer)
        self.notifications.send_notification(drive.customer.device_token,
                                             Notification(type_=NotificationType.DRIVE_FINISHED,
                                                          title='Drive finished',
                                                          body='Drive is finished').to_dict())
        return drive
