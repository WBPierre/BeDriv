import unittest

from src.looking_for_drive.infrastructure.google.pubsub.mapper.outgoing.publisher_drive_dto import PublisherDriveDTO


class TestPublisherDriveDTO(unittest.TestCase):

    def setUp(self) -> None:
        self.drive_id = 'drive'
        self.customer_id = 'customer'
        self.publisher_drive_dto = PublisherDriveDTO(drive_id=self.drive_id,
                                                     customer_id=self.customer_id)

    def test_get_drive_id(self):
        self.assertEqual(self.drive_id, self.publisher_drive_dto.drive_id)

    def test_get_customer_id(self):
        self.assertEqual(self.customer_id, self.publisher_drive_dto.customer_id)
