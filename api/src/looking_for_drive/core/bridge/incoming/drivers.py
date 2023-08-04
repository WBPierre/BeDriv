from src.looking_for_drive.core.model.driver.driver import Driver


class Drivers:

    def find_by_id(self,
                   driver_id: str) -> Driver:
        raise NotImplementedError

    def update(self,
               driver: Driver) -> Driver:
        raise NotImplementedError
