import unittest

from src.looking_for_drive.application.flask.error.incorrect_data_format_error import IncorrectDataFormatError
from src.looking_for_drive.application.flask.error.missing_data_error import MissingDataError
from src.looking_for_drive.application.flask.mapper.incoming.request_to_order_drive_information_mapper import \
    RequestToOrderDriveInformationMapper
from src.looking_for_drive.core.model.customer.payment_info import PaymentInfo
from src.looking_for_drive.core.model.drive.location import Location


class TestRequestToOrderDriveInformationMapper(unittest.TestCase):

    STRIPE_CUSTOMER_ID_KEY = 'stripe_customer_id'
    PAYMENT_METHOD_ID_KEY = 'payment_method_id'

    def setUp(self) -> None:
        self.start_key = RequestToOrderDriveInformationMapper.start_key()
        self.destination_key = RequestToOrderDriveInformationMapper.destination_key()
        self.latitude_key = RequestToOrderDriveInformationMapper.latitude_key()
        self.longitude_key = RequestToOrderDriveInformationMapper.longitude_key()
        self.estimated_price_key = RequestToOrderDriveInformationMapper.estimated_price()
        self.description_key = RequestToOrderDriveInformationMapper.description_key()
        self.input = {
            self.start_key: {
                self.latitude_key: 1,
                self.longitude_key: 1,
                self.description_key: 'start'
            },
            self.destination_key: {
                self.latitude_key: 2,
                self.longitude_key: 2,
                self.description_key: 'description'
            },
            self.estimated_price_key: 1,
            self.STRIPE_CUSTOMER_ID_KEY: 'stripe',
            self.PAYMENT_METHOD_ID_KEY: 'payment'
        }

    def test_missing_data_from_request(self):
        self.input.pop(self.start_key)

        with self.assertRaises(MissingDataError):
            RequestToOrderDriveInformationMapper.validate_input(self.input)

    def test_start_latitude_from_input_is_incorrect(self):
        self.input[self.start_key][self.latitude_key] = 'a'

        with self.assertRaises(IncorrectDataFormatError):
            RequestToOrderDriveInformationMapper.validate_input(self.input)

    def test_start_longitude_from_input_is_incorrect(self):
        self.input[self.start_key][self.longitude_key] = 'a'

        with self.assertRaises(IncorrectDataFormatError):
            RequestToOrderDriveInformationMapper.validate_input(self.input)

    def test_destination_latitude_from_input_is_incorrect(self):
        self.input[self.destination_key][self.latitude_key] = 'a'

        with self.assertRaises(IncorrectDataFormatError):
            RequestToOrderDriveInformationMapper.validate_input(self.input)

    def test_destination_longitude_from_input_is_incorrect(self):
        self.input[self.destination_key][self.longitude_key] = 'a'

        with self.assertRaises(IncorrectDataFormatError):
            RequestToOrderDriveInformationMapper.validate_input(self.input)

    def test_estimated_price_from_input_is_incorrect(self):
        self.input[self.estimated_price_key] = 'a'

        with self.assertRaises(IncorrectDataFormatError):
            RequestToOrderDriveInformationMapper.validate_input(self.input)

    def test_create_order_drive_information_from_request(self):
        start = Location(latitude=self.input[self.start_key][self.latitude_key],
                         longitude=self.input[self.start_key][self.longitude_key],
                         description=self.input[self.start_key][self.description_key])
        destination = Location(latitude=self.input[self.destination_key][self.latitude_key],
                               longitude=self.input[self.destination_key][self.longitude_key],
                               description=self.input[self.destination_key][self.description_key])
        payment_info = PaymentInfo(estimated_price=self.input[self.estimated_price_key],
                                   stripe_customer_id=self.input[self.STRIPE_CUSTOMER_ID_KEY],
                                   payment_method_id=self.input[self.PAYMENT_METHOD_ID_KEY])
        expected_output = RequestToOrderDriveInformationMapper(start=start,
                                                               destination=destination,
                                                               payment_info=payment_info)

        output = RequestToOrderDriveInformationMapper.create_order_drive_information_from_request(self.input)

        self.assertEqual(expected_output.to_dict(), output.to_dict())
