from typing import Dict, Any

from src.common.core.model.custom_object_equals import CustomObjectEquals
from src.looking_for_drive.application.flask.error.incorrect_data_format_error import IncorrectDataFormatError
from src.looking_for_drive.application.flask.error.missing_data_error import MissingDataError
from src.looking_for_drive.core.model.customer.payment_info import PaymentInfo
from src.looking_for_drive.core.model.drive.location import Location


class RequestToOrderDriveInformationMapper(CustomObjectEquals):

    __start_key = 'start'
    __latitude_key = 'latitude'
    __longitude_key = 'longitude'
    __destination_key = 'destination'
    __estimated_price_key = 'estimated_price'
    __description_key = 'description'

    @classmethod
    def start_key(cls) -> str:
        return cls.__start_key

    @classmethod
    def latitude_key(cls) -> str:
        return cls.__latitude_key

    @classmethod
    def longitude_key(cls) -> str:
        return cls.__longitude_key

    @classmethod
    def destination_key(cls) -> str:
        return cls.__destination_key

    @classmethod
    def estimated_price(cls) -> str:
        return cls.__estimated_price_key

    @classmethod
    def description_key(cls) -> str:
        return cls.__description_key

    def __init__(self,
                 start: Location = None,
                 destination: Location = None,
                 payment_info: PaymentInfo = None) -> None:
        self.start = start
        self.destination = destination
        self.payment_info = payment_info

    def to_dict(self):
        order_drive_dict = dict(start=self.start.to_dict(),
                                destination=self.destination.to_dict(),
                                estimated_price=self.estimated_price)
        return order_drive_dict

    @classmethod
    def validate_input(cls,
                       body: Dict) -> None:
        try:
            float(body[cls.__start_key][cls.__latitude_key])
            float(body[cls.__start_key][cls.__longitude_key])
            float(body[cls.__destination_key][cls.__latitude_key])
            float(body[cls.__destination_key][cls.__longitude_key])
            float(body[cls.__estimated_price_key])
        except KeyError as e:
            raise MissingDataError(str(e))
        except ValueError:
            raise IncorrectDataFormatError

    @classmethod
    def create_order_drive_information_from_request(cls,
                                                    body: Dict) -> Any:
        cls.validate_input(body)
        start = Location(latitude=body[cls.__start_key][cls.__latitude_key],
                         longitude=body[cls.__start_key][cls.__longitude_key],
                         description=body[cls.__start_key][cls.__description_key])
        destination = Location(latitude=body[cls.__destination_key][cls.__latitude_key],
                               longitude=body[cls.__destination_key][cls.__longitude_key],
                               description=body[cls.__destination_key][cls.__description_key])
        return cls(start=start,
                   destination=destination,
                   payment_info=PaymentInfo(estimated_price=body[cls.__estimated_price_key],
                                            payment_method_id=body['payment_method_id']))
