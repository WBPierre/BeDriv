from src.looking_for_drive.core.bridge.incoming.drives import Drives
from src.looking_for_drive.core.model.drive.drive import Drive


class PickUpCustomer:

    def __init__(self,
                 drives: Drives):
        self.drives = drives

    def handle(self,
               drive_id: str,
               driver_id: str) -> Drive:
        drive = self.drives.find_by_id(drive_id)

        drive.pick_up_customer(driver_id)

        self.drives.update(drive)
        return drive
