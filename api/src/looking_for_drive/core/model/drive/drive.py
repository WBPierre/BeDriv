from __future__ import annotations
from datetime import datetime
from typing import Dict, TYPE_CHECKING
from math import ceil

from src.common.core.model.custom_object_equals import CustomObjectEquals
from src.looking_for_drive.core.model.customer.customer import Customer
from src.looking_for_drive.core.model.customer.customer_drive_status import CustomerDriveStatus
from src.looking_for_drive.core.model.drive.drive_state import waiting_state, accepted_state, cancelled_state, \
    picked_up_state, finished_state
from src.looking_for_drive.core.model.drive.pricing import Pricing
from src.looking_for_drive.core.model.driver.availability import Availability
from src.looking_for_drive.core.model.driver.driver import Driver
from src.looking_for_drive.core.model.error.customer.order_drive.same_start_and_destination_error \
    import SameStartAndDestinationError

if TYPE_CHECKING:
    from src.looking_for_drive.core.model.drive.location import Location
    from src.looking_for_drive.core.model.drive.drive_state.drive_state import DriveState


class Drive(CustomObjectEquals):

    def __init__(self,
                 drive_id: str = None,
                 state: DriveState = waiting_state,
                 driver: Driver = None,
                 customer: Customer = None,
                 start_location: Location = None,
                 destination: Location = None,
                 start_time: datetime = None,
                 end_time: datetime = None,
                 price_estimate: float = None,
                 actual_price: float = None,
                 accepted_time: datetime = None,
                 cancelled_time: datetime = None,
                 picked_up_time: datetime = None,
                 payment_intent_id: str = None) -> None:
        self.__id = drive_id
        self.__state = state
        self.driver = driver
        self.customer = customer
        self.start_location = start_location
        self.destination = destination
        self.start_time = start_time if start_time is not None else datetime.now()
        self.end_time = end_time
        self.price_estimate = price_estimate
        self.actual_price = actual_price
        self.accepted_time = accepted_time
        self.cancelled_time = cancelled_time
        self.picked_up_time = picked_up_time
        self.payment_intent_id = payment_intent_id

    @property
    def id(self) -> str:
        return self.__id

    @property
    def state(self) -> DriveState:
        return self.__state

    def change_state(self,
                     state: DriveState) -> None:
        self.__state = state

    def to_dict(self) -> Dict:
        drive_dict = dict(state=self.__state.name,
                          driver=self.driver,
                          customer=self.customer,
                          start_location=self.start_location,
                          destination=self.destination,
                          start_time=self.start_time,
                          end_time=self.end_time,
                          price_estimate=self.price_estimate,
                          actual_price=self.actual_price,
                          accepted_time=self.accepted_time,
                          cancelled_time=self.cancelled_time,
                          picked_up_time=self.picked_up_time,
                          payment_intent_id=self.payment_intent_id)
        if self.customer:
            drive_dict['customer'] = self.customer.id
        if self.driver:
            drive_dict['driver'] = self.driver.id
        if self.start_location:
            drive_dict['start_location'] = self.start_location.to_dict()
        if self.destination:
            drive_dict['destination'] = self.destination.to_dict()
        return drive_dict

    def check_customer_is_inactive(self) -> None:
        self.customer.is_inactive()

    def make_customer_active(self) -> None:
        self.customer = Customer.toggle_drive_status(self.customer,
                                                     CustomerDriveStatus.ACTIVE)

    def check_start_is_different_from_destination(self):
        if self.start_location == self.destination:
            raise SameStartAndDestinationError

    def accept_drive(self,
                     driver: Driver) -> None:
        self.__state.accept_drive(self,
                                  accepted_state)
        self.driver = driver
        self.accepted_time = datetime.now()

    def make_driver_unavailable(self) -> None:
        self.driver = Driver.toggle_availability(self.driver,
                                                 Availability.UNAVAILABLE)

    def customer_cancel_drive(self,
                              customer_id: str) -> None:
        self.customer.is_the_same(customer_id)
        self.driver, self.actual_price = self.__state.customer_cancel_drive(self,
                                                                            self.driver,
                                                                            cancelled_state)
        self.customer = Customer.toggle_drive_status(self.customer,
                                                     CustomerDriveStatus.INACTIVE)
        self.customer.remove_drive_in_progress()
        self.cancelled_time = datetime.now()

    def driver_cancel_drive(self,
                            driver_id: str) -> Driver:
        self.driver.is_the_same(driver_id)
        self.__state.driver_cancel_drive(self,
                                         waiting_state)
        driver = Driver.toggle_availability(self.driver,
                                            Availability.AVAILABLE)
        self.driver = None
        return driver

    def pick_up_customer(self,
                         driver_id: str) -> None:
        self.driver.is_the_same(driver_id)
        self.__state.pick_up_customer(self,
                                      picked_up_state)
        self.picked_up_time = datetime.now()

    def finish_drive(self,
                     driver_id: str,
                     distance: int) -> None:
        self.driver.is_the_same(driver_id)
        self.__state.finish_drive(self,
                                  finished_state)
        self.end_time = datetime.now()
        duration = ceil((self.end_time.replace(tzinfo=self.start_time.tzinfo) - self.picked_up_time).total_seconds())
        self.actual_price = Pricing.calculate_price(distance,
                                                    duration).price
        self.driver = Driver.toggle_availability(self.driver,
                                                 Availability.AVAILABLE)
        self.customer = Customer.toggle_drive_status(self.customer,
                                                     CustomerDriveStatus.INACTIVE)
        self.customer.remove_drive_in_progress()

    def change_destination(self,
                           customer_id: str,
                           destination: Location,
                           distance: int,
                           duration: int) -> None:
        self.customer.is_the_same(customer_id)
        self.__state.change_destination()
        self.destination = destination
        self.price_estimate = Pricing.calculate_price(distance,
                                                      duration).price

    def add_drive_in_progress(self,
                              drive_id: str):
        self.customer.drive_in_progress = drive_id
