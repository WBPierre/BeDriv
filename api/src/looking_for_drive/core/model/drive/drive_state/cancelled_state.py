from src.looking_for_drive.core.model.drive.drive_state.drive_state import DriveState


class CancelledState(DriveState):

    name = 'cancelled'


cancelled_state = CancelledState()
