import os


google_maps_cfg = dict(url='https://maps.googleapis.com/maps/api',
                       key=os.environ.get('DISTANCE_MATRIX_KEY'),
                       distance_matrix='distancematrix/json')
