from __future__ import annotations
from typing import TYPE_CHECKING
import json


from src.config.google.google_constants import PROJECT_ID
from src.config.google.pubsub.topics import Topics
from src.looking_for_drive.core.bridge.incoming.publisher import Publisher
from src.looking_for_drive.infrastructure.google.pubsub.mapper.outgoing.publisher_drive_dto import PublisherDriveDTO

if TYPE_CHECKING:
    from google.cloud.pubsub_v1 import PublisherClient

    from src.looking_for_drive.core.model.drive.drive import Drive


class GooglePubSubPublisher(Publisher):

    def __init__(self,
                 publisher_client: PublisherClient):
        self.publisher_client = publisher_client

    def publish_location(self,
                         drive: Drive,
                         drive_id: str):
        topic_path = self.publisher_client.topic_path(PROJECT_ID, Topics.LOOKING_FOR_DRIVER.value)
        message = json.dumps(PublisherDriveDTO.create_from_drive(drive, drive_id).to_dict()).encode('utf-8')
        self.publisher_client.publish(topic_path,
                                      message)
