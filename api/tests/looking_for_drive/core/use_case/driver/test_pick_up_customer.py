import unittest

from src.looking_for_drive.core.model.drive.drive import Drive
from src.looking_for_drive.core.model.drive.drive_state import accepted_state, picked_up_state
from src.looking_for_drive.core.model.driver.driver import Driver
from src.looking_for_drive.core.model.error.driver.driver_did_not_accept_drive_error import DriverDidNotAcceptDriveError
from src.looking_for_drive.core.model.error.driver.pick_up_customer.drive_is_not_accepted_error import \
    DriveIsNotAcceptedError
from src.looking_for_drive.core.use_case.driver.pick_up_customer import PickUpCustomer
from tests.looking_for_drive.core.use_case.mock_bridge.incoming.mock_drives import MockDrives


class TestPickUpCustomer(unittest.TestCase):

    def setUp(self) -> None:
        self.drives = MockDrives()
        self.pick_up_customer = PickUpCustomer(self.drives)

        self.driver = Driver(driver_id='driver')
        self.drive = Drive(drive_id='drive',
                           state=accepted_state,
                           driver=self.driver)
        self.drives.drives[self.drive.id] = self.drive

    def test_customer_is_picked_up(self):
        self.pick_up_customer.handle(self.drive.id,
                                     self.driver.id)

        updated_drive = self.drives.drives[self.drive.id]

        self.assertEqual(picked_up_state, updated_drive.state)
        self.assertIsNotNone(updated_drive.picked_up_time)

    def test_driver_did_not_accept_drive(self):
        with self.assertRaises(DriverDidNotAcceptDriveError):
            self.pick_up_customer.handle(self.drive.id,
                                         'different_driver')

    def test_drive_is_not_accepted(self):
        self.drive.change_state(picked_up_state)
        self.drives.drives[self.drive.id] = self.drive

        with self.assertRaises(DriveIsNotAcceptedError):
            self.pick_up_customer.handle(self.drive.id,
                                         self.driver.id)
