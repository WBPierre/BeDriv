from src.looking_for_drive.core.bridge.incoming.notifications import Notifications


class MockNotifications(Notifications):

    def __init__(self):
        self.notifications = list()

    def send_notification(self,
                          receiver: str,
                          message: dict):
        self.notifications.append(dict(to=receiver,
                                       message=message))
