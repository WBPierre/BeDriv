from src.looking_for_drive.core.bridge.incoming.drives import Drives
from src.looking_for_drive.core.model.drive.drive import Drive
from src.looking_for_drive.core.model.drive.drive_state.drive_state import DriveState


class MockDrives(Drives):

    OK_DRIVE = 'ok'
    DRIVE_NOT_IN_WAITING = 'not_in_waiting'

    def __init__(self) -> None:
        self.drives = dict()

        ok_drive = Drive(drive_id=self.OK_DRIVE)
        self.drives[ok_drive.id] = ok_drive

        drive_not_in_waiting = Drive(drive_id=self.DRIVE_NOT_IN_WAITING,
                                     state=DriveState())
        self.drives[drive_not_in_waiting.id] = drive_not_in_waiting

        self.declined_drivers = list()

    def save(self,
             drive: Drive) -> str:
        self.drives[drive.id] = drive
        return drive.id

    def find_by_id(self,
                   drive_id) -> Drive:
        return self.drives[drive_id]

    def update(self,
               drive: Drive) -> Drive:
        self.drives[drive.id] = drive
        return drive

    def get_declined_drivers(self,
                             drive_id: str) -> list:
        return self.declined_drivers

    def update_declined_drivers(self,
                                drive_id: str,
                                driver_ids_list: list) -> None:
        self.declined_drivers = driver_ids_list
