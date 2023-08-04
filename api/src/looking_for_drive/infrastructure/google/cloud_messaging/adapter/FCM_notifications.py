from firebase_admin import messaging

from src.looking_for_drive.core.bridge.incoming.notifications import Notifications


class FCMNotifications(Notifications):

    def send_notification(self,
                          receiver: str,
                          message: dict):
        message = messaging.Message(
            data=dict(type=str(message['type'])),
            token=receiver,
            notification=messaging.Notification(
                title=message['title'],
                body=message['body']
            )
        )
        messaging.send(message)
