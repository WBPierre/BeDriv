from typing import Type

from src.looking_for_drive.core.model.drive.drive_state.drive_state import DriveState
from src.looking_for_drive.core.model.error.unknown_drive_state_error import UnknownDriveStateError


class DriveStateFactory:

    drive_state = dict()

    @classmethod
    def add_state(cls,
                  state: str,
                  state_class: DriveState):
        cls.drive_state[state] = state_class

    @classmethod
    def build_state(cls, state: str) -> DriveState:
        drive_state = cls.drive_state.get(state)
        if drive_state is None:
            raise UnknownDriveStateError
        return drive_state
