import React, {useEffect, useState} from 'react';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {StyleSheet, LogBox} from 'react-native';
import {Icon, Image} from 'react-native-elements';


function MapViewer(props) {
    const mapRef = React.createRef();

    return (
        <MapView
            style={styles.container}
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            showsUserLocation={false}
            showsCompass={true}
            rotateEnabled={false}
            initialRegion={{
                latitude: props.position.latitude,
                longitude: props.position.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005
            }}
        >
            <Marker.Animated
                coordinate={props.position}
                anchor={{x: 0, y: 0}}>
                <Image
                    source={require('../../../assets/image/customIcons/car.png')}
                    style={{width:60, height:60, transform: props.orient !== null ? [{rotate: `360-${props.orient}deg`}] : [{rotate: "0deg"}]}}
                    resizeMode="contain"
                />
            </Marker.Animated>
        </MapView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});
export default MapViewer;
