import unittest

from src.looking_for_drive.core.model.drive.location import Location
from src.looking_for_drive.core.model.drive.pricing import Pricing
from src.looking_for_drive.core.use_case.customer.estimate_price import EstimatePrice
from tests.looking_for_drive.core.use_case.mock_bridge.incoming.mock_distances import MockDistances


class TestEstimatePrice(unittest.TestCase):

    def setUp(self) -> None:
        self.estimate_price = EstimatePrice(MockDistances())

    def test_price_is_estimated(self):
        start = Location(.1, .1)
        destination = Location(.1, .1)
        price_expected = Pricing.base() + \
            Pricing.per_km() + \
            Pricing.per_minute()
        price_estimated = self.estimate_price.handle(start, destination)
        self.assertEqual(price_expected,
                         price_estimated.price,
                         'incorrect price estimation')
