import unittest
from unittest.mock import patch, MagicMock, Mock

import tests.common.infrastructure.firestore.mock_firestore_import

from src.bedriv import app
from src.looking_for_drive.application.flask.error.incorrect_data_format_error import IncorrectDataFormatError
from src.looking_for_drive.application.flask.error.missing_data_error import MissingDataError
from src.looking_for_drive.application.flask.mapper.incoming.request_to_order_drive_information_mapper import \
    RequestToOrderDriveInformationMapper
from src.looking_for_drive.application.flask.mapper.outgoing.customer.order_drive_dto import OrderDriveDTO
from src.looking_for_drive.core.model.customer.customer import Customer
from src.looking_for_drive.core.model.customer.customer_drive_status import CustomerDriveStatus
from src.looking_for_drive.core.model.customer.payment_info import PaymentInfo
from src.looking_for_drive.core.model.drive.drive import Drive
from src.looking_for_drive.core.model.drive.location import Location
from src.looking_for_drive.core.model.error.customer.order_drive.customer_has_drive_in_progress_error import CustomerHasDriveInProgressError
from src.looking_for_drive.core.model.error.customer.order_drive.same_start_and_destination_error import SameStartAndDestinationError
from src.looking_for_drive.infrastructure.firestore.error.customer_not_found_error import CustomerNotFoundError
from tests.looking_for_drive.application.controller.route.drive_route_constants import \
    DRIVE_ROUTE, DRIVE_CUSTOMER_ROUTE_MODULE_PATH, HANDLE


class TestOrderDriveRoute(unittest.TestCase):

    ORDER_DRIVE_ROUTE_MODULE_PATH = F'{DRIVE_CUSTOMER_ROUTE_MODULE_PATH}.order_drive_route'

    ORDER_DRIVE = F'{ORDER_DRIVE_ROUTE_MODULE_PATH}.OrderDrive'

    REQUEST_TO_ORDER_DRIVE_INFORMATION_MAPPER = F'{ORDER_DRIVE_ROUTE_MODULE_PATH}.RequestToOrderDriveInformationMapper'
    CREATE_ORDER_DRIVE_INFORMATION_FROM_REQUEST = 'create_order_drive_information_from_request'

    ORDER_DRIVE_ROUTE = F'{DRIVE_ROUTE}/order'

    START_KEY = 'start'
    DESTINATION_KEY = 'destination'
    LATITUDE_KEY = 'latitude'
    LONGITUDE_KEY = 'longitude'
    ESTIMATED_PRICE_KEY = 'estimated_price'
    STRIPE_CUSTOMER_ID_KEY = 'stripe_customer_id'
    PAYMENT_METHOD_ID_KEY = 'payment_method_id'

    def setUp(self) -> None:
        self.client = app.test_client()
        self.request_body = {
            self.START_KEY: {
                self.LATITUDE_KEY: 1,
                self.LONGITUDE_KEY: 1
            },
            self.DESTINATION_KEY: {
                self.LATITUDE_KEY: 2,
                self.LONGITUDE_KEY: 2
            },
            self.ESTIMATED_PRICE_KEY: 3,
            self.STRIPE_CUSTOMER_ID_KEY: 'stripe',
            self.PAYMENT_METHOD_ID_KEY: 'payment'
        }

    @patch(ORDER_DRIVE)
    @patch(REQUEST_TO_ORDER_DRIVE_INFORMATION_MAPPER)
    def test_drive_is_created(self,
                              request_to_order_drive_information_mapper_mock: MagicMock,
                              order_drive_mock: MagicMock):
        start = Location(latitude=self.request_body[self.START_KEY][self.LATITUDE_KEY],
                         longitude=self.request_body[self.START_KEY][self.LONGITUDE_KEY])
        destination = Location(latitude=self.request_body[self.DESTINATION_KEY][self.LATITUDE_KEY],
                               longitude=self.request_body[self.DESTINATION_KEY][self.LONGITUDE_KEY])
        payment_info = PaymentInfo(estimated_price=self.request_body[self.ESTIMATED_PRICE_KEY],
                                   stripe_customer_id=self.request_body[self.STRIPE_CUSTOMER_ID_KEY],
                                   payment_method_id=self.request_body[self.PAYMENT_METHOD_ID_KEY])
        order_drive_information = RequestToOrderDriveInformationMapper(start=start,
                                                                       destination=destination,
                                                                       payment_info=payment_info)
        create_order_drive_information_from_request_mock = Mock(return_value=order_drive_information)
        request_to_order_drive_information_mapper_mock.attach_mock(create_order_drive_information_from_request_mock,
                                                                   self.CREATE_ORDER_DRIVE_INFORMATION_FROM_REQUEST)
        customer = Customer(customer_id='a',
                            name='Alex',
                            drive_status=CustomerDriveStatus.ACTIVE)
        drive_created = Drive(start_location=start,
                              destination=destination,
                              customer=customer,
                              price_estimate=self.request_body[self.ESTIMATED_PRICE_KEY],
                              drive_id='drive')
        client_secret_created = 'ok'
        handle_mock = Mock(return_value=(drive_created.id, drive_created, client_secret_created))
        order_drive_mock().attach_mock(handle_mock,
                                       HANDLE)

        response = self.client.post(F'{self.ORDER_DRIVE_ROUTE}/{customer.id}',
                                    json=self.request_body)

        expected_status_code = 201
        expected_response_content = OrderDriveDTO(drive_id=drive_created.id,
                                                  customer_id=customer.id,
                                                  state=drive_created.state.name,
                                                  client_secret=client_secret_created).to_dict()
        create_order_drive_information_from_request_mock.assert_called_once_with(self.request_body)
        handle_mock.assert_called_once_with(start,
                                            destination,
                                            customer.id,
                                            payment_info)
        self.assertEqual(expected_status_code, response.status_code)
        self.assertEqual(expected_response_content, response.json)

    @patch(REQUEST_TO_ORDER_DRIVE_INFORMATION_MAPPER)
    def test_key_is_missing_from_request_body(self,
                                              request_to_order_drive_information_mapper_mock: MagicMock):
        missing_key = 'start'

        create_order_drive_information_from_request_mock = Mock(side_effect=MissingDataError(missing_key))
        request_to_order_drive_information_mapper_mock.attach_mock(create_order_drive_information_from_request_mock,
                                                                   self.CREATE_ORDER_DRIVE_INFORMATION_FROM_REQUEST)

        response = self.client.post(F'{self.ORDER_DRIVE_ROUTE}/a',
                                    json=self.request_body)

        create_order_drive_information_from_request_mock.assert_called_once_with(self.request_body)

        expected_content = dict(message=F'{missing_key} is missing from request body')
        expected_status_code = 400

        self.assertEqual(expected_content, response.json)
        self.assertEqual(expected_status_code, response.status_code)

    @patch(REQUEST_TO_ORDER_DRIVE_INFORMATION_MAPPER)
    def test_data_format_is_incorrect(self,
                                      request_to_order_drive_information_mapper_mock: MagicMock):
        create_order_drive_information_from_request_mock = Mock(side_effect=IncorrectDataFormatError())
        request_to_order_drive_information_mapper_mock.attach_mock(create_order_drive_information_from_request_mock,
                                                                   self.CREATE_ORDER_DRIVE_INFORMATION_FROM_REQUEST)

        res = self.client.post(F'{self.ORDER_DRIVE_ROUTE}/a',
                               json=self.request_body)

        create_order_drive_information_from_request_mock.assert_called_once_with(self.request_body)

        expected_content = dict(message='The provided data is incorrect')
        expected_status_code = 400

        self.assertEqual(expected_content, res.json)
        self.assertEqual(expected_status_code, res.status_code)

    @patch(ORDER_DRIVE)
    @patch(REQUEST_TO_ORDER_DRIVE_INFORMATION_MAPPER)
    def test_customer_has_drive_in_progress(self,
                                            request_to_order_drive_information_mapper_mock: MagicMock,
                                            order_drive_mock: MagicMock):
        handle_mock = Mock(side_effect=CustomerHasDriveInProgressError())
        order_drive_mock().attach_mock(handle_mock,
                                       HANDLE)
        
        response = self.client.post(F'{self.ORDER_DRIVE_ROUTE}/a',
                                    json=self.request_body)

        request_to_order_drive_information_mapper_mock.create_order_drive_information_from_request\
            .assert_called_once_with(self.request_body)
        handle_mock.assert_called_once()
        
        expected_content = dict(message='The customer already has a drive in progress')
        expected_status_code = 423
        
        self.assertEqual(expected_content, response.json)
        self.assertEqual(expected_status_code, response.status_code)

    @patch(ORDER_DRIVE)
    @patch(REQUEST_TO_ORDER_DRIVE_INFORMATION_MAPPER)
    def test_same_start_and_destination(self,
                                        request_to_order_drive_information_mapper_mock: MagicMock,
                                        order_drive_mock: MagicMock):
        handle_mock = Mock(side_effect=SameStartAndDestinationError())
        order_drive_mock().attach_mock(handle_mock,
                                       HANDLE)

        response = self.client.post(F'{self.ORDER_DRIVE_ROUTE}/a',
                                    json=self.request_body)

        request_to_order_drive_information_mapper_mock.create_order_drive_information_from_request\
            .assert_called_once_with(self.request_body)
        handle_mock.assert_called_once()

        expected_content = dict(message='The start and destination is the same')
        expected_status_code = 400

        self.assertEqual(expected_content, response.json)
        self.assertEqual(expected_status_code, response.status_code)

    @patch(ORDER_DRIVE)
    @patch(REQUEST_TO_ORDER_DRIVE_INFORMATION_MAPPER)
    def test_customer_not_found(self,
                                request_to_order_drive_information_mapper_mock: MagicMock,
                                order_drive_mock: MagicMock):
        handle_mock = Mock(side_effect=CustomerNotFoundError())
        order_drive_mock().attach_mock(handle_mock,
                                       HANDLE)

        response = self.client.post(F'{self.ORDER_DRIVE_ROUTE}/a',
                                    json=self.request_body)

        request_to_order_drive_information_mapper_mock.create_order_drive_information_from_request\
            .assert_called_once_with(self.request_body)
        handle_mock.assert_called_once()

        expected_content = dict(message='Customer not found')
        expected_status_code = 404

        self.assertEqual(expected_content, response.json)
        self.assertEqual(expected_status_code, response.status_code)
