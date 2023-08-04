from __future__ import annotations
from typing import TYPE_CHECKING

from src.looking_for_drive.core.model.notification.notification import Notification
from src.looking_for_drive.core.model.notification.notification_type import NotificationType

if TYPE_CHECKING:
    from src.looking_for_drive.core.bridge.incoming.customers import Customers
    from src.looking_for_drive.core.bridge.incoming.drivers import Drivers
    from src.looking_for_drive.core.bridge.incoming.drives import Drives
    from src.looking_for_drive.core.bridge.incoming.notifications import Notifications
    from src.looking_for_drive.core.model.drive.drive import Drive


class CancelDrive:

    def __init__(self,
                 drives: Drives,
                 customers: Customers,
                 drivers: Drivers,
                 notifications: Notifications):
        self.drives = drives
        self.customers = customers
        self.drivers = drivers
        self.notifications = notifications

    def handle(self,
               customer_id: str,
               drive_id: str) -> Drive:
        drive = self.drives.find_by_id(drive_id)

        drive.customer_cancel_drive(customer_id)

        self.drives.update(drive)
        self.customers.update(drive.customer)
        if drive.driver:
            self.drivers.update(drive.driver)
            self.notifications.send_notification(drive.driver.device_token,
                                                 Notification(type_=NotificationType.CUSTOMER_CANCELLED_DRIVE,
                                                              title='Drive cancelled',
                                                              body='Drive has been cancelled').to_dict())

        return drive
