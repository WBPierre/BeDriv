import unittest
import json

from src.config.google.pubsub.topics import Topics
from src.looking_for_drive.core.model.customer.customer import Customer
from src.looking_for_drive.core.model.drive.drive import Drive
from src.looking_for_drive.core.model.drive.location import Location
from src.looking_for_drive.infrastructure.google.pubsub.adapter.google_pubsub_publisher import GooglePubSubPublisher
from tests.looking_for_drive.infrastructure.google.pubsub.mock_publisher_client import MockPublisherClient


class TestGooglePubSubPublisher(unittest.TestCase):

    def setUp(self) -> None:
        self.google_pubsub_publisher = GooglePubSubPublisher(MockPublisherClient())

    def test_message_is_published(self):
        drive = Drive(drive_id='drive',
                      customer=Customer(customer_id='customer',
                                        name='Alex'),
                      start_location=Location(1, 1),
                      destination=Location(2, 2),
                      price_estimate=1)
        self.google_pubsub_publisher.publish_location(drive, 'drive')

        expected_message = json.dumps(dict(drive_id=drive.id,
                                           customer_id=drive.customer.id,
                                           customer_name=drive.customer.name,
                                           start=drive.start_location.to_dict(),
                                           destination=drive.destination.to_dict(),
                                           estimated_price=drive.price_estimate)).encode('utf-8')
        self.assertIn(expected_message,
                      self.google_pubsub_publisher.publisher_client.topics[Topics.LOOKING_FOR_DRIVER.value])
