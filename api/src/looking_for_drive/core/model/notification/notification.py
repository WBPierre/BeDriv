from src.looking_for_drive.core.model.notification.notification_type import NotificationType


class Notification:

    def __init__(self,
                 type_: NotificationType = None,
                 title: str = None,
                 body: str = None):
        self.type = type_
        self.title = title
        self.body = body

    def to_dict(self):
        notification_dict = dict(type=self.type.value,
                                 title=self.title,
                                 body=self.body)
        return notification_dict
