from __future__ import annotations
from typing import TYPE_CHECKING

from src.looking_for_drive.core.bridge.incoming.publisher import Publisher
from src.looking_for_drive.core.model.notification.notification import Notification
from src.looking_for_drive.core.model.notification.notification_type import NotificationType

if TYPE_CHECKING:
    from src.looking_for_drive.core.bridge.incoming.drivers import Drivers
    from src.looking_for_drive.core.bridge.incoming.drives import Drives
    from src.looking_for_drive.core.bridge.incoming.notifications import Notifications
    from src.looking_for_drive.core.model.drive.drive import Drive


class CancelDrive:

    def __init__(self,
                 drives: Drives,
                 drivers: Drivers,
                 notifications: Notifications,
                 publisher: Publisher):
        self.drives = drives
        self.drivers = drivers
        self.notifications = notifications
        self.publisher = publisher

    def handle(self,
               driver_id: str,
               drive_id: str) -> Drive:
        drive = self.drives.find_by_id(drive_id)
        declined_drivers = self.drives.get_declined_drivers(drive_id)

        driver = drive.driver_cancel_drive(driver_id)
        declined_drivers.append(driver.id)

        self.drives.update(drive)
        self.drives.update_declined_drivers(drive.id,
                                            declined_drivers)
        self.drivers.update(driver)
        self.publisher.publish_location(drive,
                                        drive.id)
        self.notifications.send_notification(drive.customer.device_token,
                                             Notification(type_=NotificationType.DRIVER_CANCELLED_DRIVE,
                                                          title='Drive cancelled',
                                                          body='Drive has been cancelled').to_dict())
        return drive
