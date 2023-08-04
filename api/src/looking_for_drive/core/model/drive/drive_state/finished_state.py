from src.looking_for_drive.core.model.drive.drive_state.drive_state import DriveState


class FinishedState(DriveState):

    name = 'finished'


finished_state = FinishedState()
