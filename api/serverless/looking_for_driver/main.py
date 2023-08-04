import base64
import json
import os
from typing import Dict

import firebase_admin
from firebase_admin import db, messaging
from google.cloud import firestore

from looking_for_driver.model.geolocation import Geolocation
from looking_for_driver.model.device import Device

REALTIME_DB_URL = os.environ['REALTIME_DB_URL']
firebase_admin.initialize_app(options={
    'databaseURL': REALTIME_DB_URL
})
firestore_db = firestore.Client()


def looking_for_driver(event, context):
    data = base64.b64decode(event['data']).decode('utf-8')
    data_dict = json.loads(data)
    start = Geolocation.create_from_json(data_dict)
    min_location, max_location = start.bounding_locations(3)

    ref = db.reference('devices')
    devices = ref.order_by_child('longitude').start_at(min_location.deg_long).end_at(max_location.deg_long).get()
    devices = [device for device in list(devices.items())
               if device[1]['active']
               and min_location.deg_lat < device[1]['latitude'] < max_location.deg_lat]
    drive = firestore_db.collection('drives').document(data_dict['drive_id']).get().to_dict()
    declined_drivers = drive.get('declined_drivers', [])
    if declined_drivers:
        devices = [device for device in devices if device[0] not in declined_drivers]

    devices = sorted([Device.create_from_tuple(device, start) for device in devices],
                     key=lambda device: device.distance_from_start)

    def flatten_and_convert_data_to_string(data: Dict) -> Dict:
        data['start_latitude'] = str(data['start']['latitude'])
        data['start_longitude'] = str(data['start']['longitude'])
        data['start_description'] = data['start']['description']
        data.pop('start')
        data['destination_latitude'] = str(data['destination']['latitude'])
        data['destination_longitude'] = str(data['destination']['longitude'])
        data['destination_description'] = data['destination']['description']
        data.pop('destination')
        data['estimated_price'] = str(data['estimated_price'])
        return data

    if len(devices) == 0:
        customer = drive['customer'].get().to_dict()
        message = messaging.Message(
            data=dict(status='404',
                      type='search'),
            notification=messaging.Notification(
                title='Driver not found',
                body='No driver is available at the moment, please try again later'
            ),
            token=customer['device_token']
        )
    else:
        message = messaging.Message(
            data=flatten_and_convert_data_to_string(data_dict),
            token=devices[0].id
        )
    messaging.send(message)


'''if __name__ == '__main__':
    event = dict(data=base64.b64encode(json.dumps(dict(drive_id='drive',
                                                       customer_id='customer',
                                                       customer_name='Alex',
                                                       start=dict(latitude=48.83809629639607, longitude=2.4836639154123583),
                                                       destination=dict(latitude=2, longitude=2))).encode('utf-8')))
    looking_for_driver(event, None)'''
