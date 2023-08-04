from src.looking_for_drive.core.model.drive.drive_state.accepted_state import accepted_state
from src.looking_for_drive.core.model.drive.drive_state.cancelled_state import cancelled_state
from src.looking_for_drive.core.model.drive.drive_state.drive_state_factory import DriveStateFactory
from src.looking_for_drive.core.model.drive.drive_state.finished_state import finished_state
from src.looking_for_drive.core.model.drive.drive_state.picked_up_state import picked_up_state
from src.looking_for_drive.core.model.drive.drive_state.waiting_state import waiting_state

DriveStateFactory.add_state('waiting', waiting_state)
DriveStateFactory.add_state('accepted', accepted_state)
DriveStateFactory.add_state('cancelled', cancelled_state)
DriveStateFactory.add_state('picked_up', picked_up_state)
DriveStateFactory.add_state('finished', finished_state)
