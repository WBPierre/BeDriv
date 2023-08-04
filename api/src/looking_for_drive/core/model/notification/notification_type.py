import enum


class NotificationType(enum.Enum):
    CUSTOMER_CANCELLED_DRIVE = 0
    DRIVER_ACCEPTED_DRIVE = 1
    DRIVER_CANCELLED_DRIVE = 2
    DRIVE_FINISHED = 3
