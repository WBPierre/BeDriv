from typing import Dict

from src.looking_for_drive.core.model.drive.drive import Drive
from src.looking_for_drive.core.model.drive.drive_state import DriveStateFactory
from src.looking_for_drive.core.model.drive.location import Location
from src.looking_for_drive.infrastructure.firestore.mapper.incoming.customer_mapper import customer_mapper
from src.looking_for_drive.infrastructure.firestore.mapper.incoming.driver_mapper import driver_mapper


class DriveMapper:

    @staticmethod
    def create_drive_from_firestore(drive_id: str,
                                    drive: Dict) -> Drive:
        drive = Drive(drive_id=drive_id,
                      state=DriveStateFactory.build_state(drive['state']),
                      driver=drive['driver'],
                      customer=drive['customer'],
                      start_location=DriveMapper.create_location(drive['start_location']),
                      destination=DriveMapper.create_location(drive['destination']),
                      start_time=drive['start_time'],
                      end_time=drive['end_time'],
                      price_estimate=drive['price_estimate'],
                      actual_price=drive['actual_price'],
                      accepted_time=drive['accepted_time'],
                      cancelled_time=drive['cancelled_time'],
                      picked_up_time=drive['picked_up_time'],
                      payment_intent_id=drive['payment_intent_id'])
        if drive.customer:
            customer = drive.customer.get()
            customer = customer_mapper(customer.id,
                                       customer.to_dict())
            drive.customer = customer
        if drive.driver:
            driver = drive.driver.get()
            driver = driver_mapper(driver.id,
                                   driver.to_dict())
            drive.driver = driver
        return drive

    @staticmethod
    def create_location(location: Dict) -> Location:
        location = Location(latitude=location['latitude'],
                            longitude=location['longitude'],
                            description=location['description'])
        return location
