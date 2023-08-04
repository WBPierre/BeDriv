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
            showsUserLocation
            showsCompass={true}
            initialRegion={{
                latitude: props.position.latitude,
                longitude: props.position.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005
            }}
        />
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});
export default MapViewer;
