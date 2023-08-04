from __future__ import annotations
from typing import TYPE_CHECKING

from src.looking_for_drive.core.model.notification.notification import Notification
from src.looking_for_drive.core.model.notification.notification_type import NotificationType

if TYPE_CHECKING:
    from src.looking_for_drive.core.bridge.incoming.drivers import Drivers
    from src.looking_for_drive.core.bridge.incoming.drives import Drives
    from src.looking_for_drive.core.bridge.incoming.notifications import Notifications
    from src.looking_for_drive.core.model.drive.drive import Drive


class AcceptDrive:

    def __init__(self,
                 drives: Drives,
                 drivers: Drivers,
                 notifications: Notifications) -> None:
        self.drives = drives
        self.drivers = drivers
        self.notifications = notifications

    def handle(self,
               drive_id: str,
               driver_id: str) -> Drive:
        drive = self.drives.find_by_id(drive_id)
        driver = self.drivers.find_by_id(driver_id)

        driver.is_available()
        drive.accept_drive(driver)
        drive.make_driver_unavailable()

        self.drives.update(drive)
        self.drivers.update(drive.driver)
        self.notifications.send_notification(drive.customer.device_token,
                                             Notification(type_=NotificationType.DRIVER_ACCEPTED_DRIVE,
                                                          title='Drive accepted',
                                                          body=F'Drive has been accepted by {driver.name}').to_dict())
        return drive
