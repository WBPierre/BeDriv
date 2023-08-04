import unittest

from src.looking_for_drive.core.model.drive.drive_state import DriveStateFactory, waiting_state, accepted_state, \
    cancelled_state
from src.looking_for_drive.core.model.drive.drive_state.drive_state import DriveState
from src.looking_for_drive.core.model.error.unknown_drive_state_error import UnknownDriveStateError


class TestDriveStateFactory(unittest.TestCase):

    def test_create_waiting_state(self):
        state = DriveStateFactory.build_state('waiting')

        self.assertEqual(waiting_state, state)

    def test_create_accepted_state(self):
        state = DriveStateFactory.build_state('accepted')

        self.assertEqual(accepted_state, state)

    def test_create_cancelled_state(self):
        state = DriveStateFactory.build_state('cancelled')

        self.assertEqual(cancelled_state, state)

    def test_unknown_drive_state(self):
        with self.assertRaises(UnknownDriveStateError):
            DriveStateFactory.build_state('unknown')

    def test_add_state(self):
        class TestState(DriveState):
            pass
        test_state = TestState()
        DriveStateFactory.add_state('test', test_state)

        self.assertEqual(test_state, DriveStateFactory.build_state('test'))
