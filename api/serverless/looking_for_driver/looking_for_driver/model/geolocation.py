from __future__ import annotations

import math
from typing import Tuple


class Geolocation:
    """
        Class representing a coordinate on a sphere, most likely Earth.

        This class is based from the code sample in this paper:
            http://janmatuschek.de/LatitudeLongitudeBoundingCoordinates

        The owner of that website, Jan Philip Matuschek, is the full owner of
        his intellectual property. This class is simply a Python port of his very
        useful Java code. All code written by Jan Philip Matuschek and ported by Jeremy Fein
        (which is all of this class) is owned by Jan Philip Matuschek.
    """

    MIN_LAT = math.radians(-90)
    MAX_LAT = math.radians(90)
    MIN_LON = math.radians(-180)
    MAX_LON = math.radians(180)

    EARTH_RADIUS = 6378.1

    @classmethod
    def from_degrees(cls, deg_lat, deg_long):
        rad_lat = math.radians(deg_lat)
        rad_long = math.radians(deg_long)
        return cls(deg_lat, deg_long, rad_lat, rad_long)

    @classmethod
    def from_radians(cls, rad_lat, rad_long):
        deg_lat = math.degrees(rad_lat)
        deg_long = math.degrees(rad_long)
        return cls(deg_lat, deg_long, rad_lat, rad_long)

    def __init__(self,
                 deg_lat: float,
                 deg_long: float,
                 rad_lat: float = None,
                 rad_long: float = None):
        self.deg_lat = deg_lat
        self.deg_long = deg_long
        self.rad_lat = rad_lat
        self.rad_long = rad_long

    @classmethod
    def create_from_json(cls,
                         json_dict: dict) -> Geolocation:
        geolocation = cls.from_degrees(json_dict['start']['latitude'],
                                       json_dict['start']['longitude'])
        return geolocation

    def to_dict(self):
        geolocation_dict = dict(latitude=self.deg_lat,
                                longitude=self.deg_long,
                                rad_lat=self.rad_lat,
                                rad_long=self.rad_long)
        return geolocation_dict

    def bounding_locations(self,
                           distance: float,
                           radius=EARTH_RADIUS) -> Tuple[Geolocation, Geolocation]:
        """
        Computes the bounding coordinates of all points on the surface
        of a sphere that has a great circle distance to the point represented
        by this GeoLocation instance that is less or equal to the distance argument.

        Param:
            distance - the distance from the point represented by this GeoLocation
                       instance. Must be measured in the same unit as the radius
                       argument (which is kilometers by default)

            radius   - the radius of the sphere. defaults to Earth's radius.

        Returns a list of two GeoLoations - the SW corner and the NE corner - that
        represents the bounding box.
        """

        # angular distance in radians on a great circle
        rad_dist = distance / radius

        min_lat = self.rad_lat - rad_dist
        max_lat = self.rad_lat + rad_dist

        if min_lat > Geolocation.MIN_LAT and max_lat < Geolocation.MAX_LAT:
            delta_lon = math.asin(math.sin(rad_dist) / math.cos(self.rad_lat))

            min_lon = self.rad_long - delta_lon
            if min_lon < Geolocation.MIN_LON:
                min_lon += 2 * math.pi

            max_lon = self.rad_long + delta_lon
            if max_lon > Geolocation.MAX_LON:
                max_lon -= 2 * math.pi
        # a pole is within the distance
        else:
            min_lat = max(min_lat, Geolocation.MIN_LAT)
            max_lat = min(max_lat, Geolocation.MAX_LAT)
            min_lon = Geolocation.MIN_LON
            max_lon = Geolocation.MAX_LON

        return Geolocation.from_radians(min_lat, min_lon), Geolocation.from_radians(max_lat, max_lon)

    def distance_to(self,
                    other: Geolocation,
                    radius: float = EARTH_RADIUS) -> float:
        """
        Computes the great circle distance between this GeoLocation instance
        and the other.
        """
        border_value = math.sin(self.rad_lat) * math.sin(other.rad_lat) + \
                       math.cos(self.rad_lat) * \
                       math.cos(other.rad_lat) * \
                       math.cos(self.rad_long - other.rad_long)
        border_value = min(border_value, 1)
        border_value = max(border_value, -1)
        return radius * math.acos(border_value)
