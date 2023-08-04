import React, {createRef, useEffect, useState} from 'react';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {Image, StyleSheet} from 'react-native';
import GetLocation from 'react-native-get-location'
import {Icon} from 'react-native-elements';


function MapViewer(props){
    const mapRef = createRef();


    useEffect(() => {
        if(props.driver !== null){
            mapRef.current.animateToRegion(getRegionForCoordinates(props.position, props.driver));
        }
    }, [props.driver])

    const getRegionForCoordinates = (user, driver) => {
        // points should be an array of { latitude: X, longitude: Y }
        let minX, maxX, minY, maxY;

        // init first point
        minX = user.latitude;
        maxX = user.latitude;
        minY = user.longitude;
        maxY = user.longitude;

        // calculate rect
        minX = Math.min(minX, driver.latitude);
        maxX = Math.max(maxX, driver.latitude);
        minY = Math.min(minY, driver.longitude);
        maxY = Math.max(maxY, driver.longitude);

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

    return(
        <MapView
            style={styles.container}
            provider={PROVIDER_GOOGLE}
            showsUserLocation
            showsMyLocationButton={true}
            showsTraffic={false}
            showsIndoors={false}
            rotateEnabled={false}
            initialRegion={{
                latitude: props.position.latitude,
                longitude: props.position.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005
            }}
            ref={mapRef}
        >
            {props.driver !== null &&
            <Marker.Animated
                coordinate={props.driver}>
                <Image
                    source={require('../../../assets/image/customIcons/car.png')}
                    style={{width:60, height:60, transform: props.direction !== null ? [{rotate: `${props.direction}deg`}] : [{rotate: "0deg"}]}}
                    resizeMode="contain"
                />
            </Marker.Animated>
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
