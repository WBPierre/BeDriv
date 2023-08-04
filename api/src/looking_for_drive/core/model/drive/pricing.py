from __future__ import annotations

from typing import Dict


class Pricing:

    __base = 1.2
    __per_km = 1.05
    __per_minute = .3

    def __init__(self,
                 distance: int,
                 duration: int,
                 price: float):
        self.distance = distance
        self.duration = duration
        self.price = price

    def to_dict(self) -> Dict:
        pricing_dict = dict(distance=self.distance,
                            duration=self.duration,
                            price=self.price)
        return pricing_dict

    @classmethod
    def base(cls) -> float:
        return cls.__base

    @classmethod
    def per_km(cls) -> float:
        return cls.__per_km

    @classmethod
    def per_minute(cls) -> float:
        return cls.__per_minute

    @classmethod
    def calculate_price(cls, distance: int, duration: int) -> Pricing:
        price = cls.__base + \
                float(distance / 1000) * cls.__per_km + \
                float(duration / 60) * cls.__per_minute
        pricing = cls(distance,
                      duration,
                      price)
        return pricing
