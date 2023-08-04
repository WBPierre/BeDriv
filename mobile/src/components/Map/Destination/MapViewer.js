import React, {createRef, useEffect, useRef, useState} from 'react';
import MapView, {PROVIDER_GOOGLE} from "react-native-maps";
import {StyleSheet, View} from 'react-native';
import Polyline from '@mapbox/polyline';
import GetLocation from 'react-native-get-location'
import {Icon} from 'react-native-elements';


function MapViewer(props){

    const mapRef = createRef();
    const [coordinates, setCoordinates] = useState(null);
    const [destinationMarker, setDestinationMarker] = useState(null);

    const getRegionForCoordinates = (points) => {
        // points should be an array of { latitude: X, longitude: Y }
        let minX, maxX, minY, maxY;

        // init first point
        ((point) => {
            minX = point.latitude;
            maxX = point.latitude;
            minY = point.longitude;
            maxY = point.longitude;
        })(points[0]);

        // calculate rect
        points.map((point) => {
            minX = Math.min(minX, point.latitude);
            maxX = Math.max(maxX, point.latitude);
            minY = Math.min(minY, point.longitude);
            maxY = Math.max(maxY, point.longitude);
        });

        const midX = (minX + maxX) / 2;
        const midY = (minY + maxY) / 2;
        const deltaX = (maxX - minX)*1.2;
        const deltaY = (maxY - minY)*1.2;

        return {
            latitude: midX,
            longitude: midY,
            latitudeDelta: deltaX+0.001,
            longitudeDelta: deltaY+0.001
        };
    }

    useEffect( () => {
        if(coordinates !== null){
            mapRef.current.animateToRegion(getRegionForCoordinates(coordinates));
        }
    }, [coordinates]);

    useEffect(() => {
        if(props.polylines !== null){
            let points = Polyline.decode(props.polylines.points);
            let coords = points.map((point, index) => {
                return {
                    latitude: point[0],
                    longitude: point[1]
                };
            });
            setCoordinates(coords);
            setDestinationMarker({
                latitude:props.directions[0].end_location.lat,
                longitude:props.directions[0].end_location.lng,
            });
        }
    }, [props])


    return(
        <MapView
            style={styles.container}
            provider={PROVIDER_GOOGLE}
            showsUserLocation
            showsMyLocationButton={false}
            showsTraffic={false}
            showsIndoors={false}
            rotateEnabled={false}
            zoomControlEnabled={true}
            initialRegion={{
                latitude:props.directions[0].start_location.lat,
                longitude:props.directions[0].start_location.lng,
                latitudeDelta:0.005,
                longitudeDelta:0.005
            }}
            ref={mapRef}
        >
            {coordinates !== null &&
            <MapView.Polyline
                coordinates={coordinates}
                strokeColor="#3A476A"
                strokeWidth={5}/>
            }
            {destinationMarker !== null &&
            <MapView.Marker
                tracksViewChanges={false}
                coordinate={destinationMarker}>
                <Icon
                    name='map-marker'
                    type="font-awesome"
                    color='#2E364F'
                    size={36}/>
            </MapView.Marker>
            }
        </MapView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});
export default MapViewer;
