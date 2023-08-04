from src.looking_for_drive.core.bridge.incoming.drivers import Drivers
from src.looking_for_drive.core.model.driver.availability import Availability
from src.looking_for_drive.core.model.driver.driver import Driver


class MockDrivers(Drivers):

    OK_DRIVER = 'ok'
    UNAVAILABLE_DRIVER = 'unavailable'

    def __init__(self):
        self.drivers = dict()

        self.drivers[self.OK_DRIVER] = Driver(driver_id=self.OK_DRIVER)

        unavailable = Driver(driver_id=self.UNAVAILABLE_DRIVER,
                             name='Alex',
                             available=Availability.UNAVAILABLE)
        self.drivers[self.UNAVAILABLE_DRIVER] = unavailable

    def find_by_id(self,
                   driver_id: str) -> Driver:
        return self.drivers[driver_id]

    def update(self,
               driver: Driver) -> Driver:
        self.drivers[driver.id] = driver
        return self.drivers[driver.id]
