class CustomObjectEquals:

    def __eq__(self, other) -> bool:
        for key, value in self.__dict__.items():
            if other.__dict__[key] != value:
                return False
        return True
