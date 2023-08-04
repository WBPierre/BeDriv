import React from 'react';
import {StyleSheet, View} from 'react-native';
import Svg, {G, Polygon, Rect} from 'react-native-svg';

function Background(){
    return(
        <View style={styles.container}>
            <Svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%' viewBox='0 0 100 100' preserveAspectRatio="none">
                <Rect fill='#283149' width='100%' height='100%'/>
                <G>
                <Polygon fill='#21283c' points='100 33 0 70 0 57 100 19'/>
                <Polygon fill='#1d2435' points='100 45 0 83 0 70 100 31'/>
                <Polygon fill='#1a1f2f' points='100 58 0 95 0 81 100 44'/>
                <Polygon fill='#161b28' points='100 100 0 100 0 94 100 57'/>
                </G>
            </Svg>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width:'100%',
        height:'100%',
        position:'absolute',
    },
});

export default Background;
/*
background-color: #283149;
background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' polygon fill='%23242d42' points='1600 160 0 460 0 350 1600 50'/%3E%3Cpolygon fill='%2321283c' points='1600 260 0 560 0 450 1600 150'/%3E%3Cpolygon fill='%231d2435' points='1600 360 0 660 0 550 1600 250'/%3E%3Cpolygon fill='%231a1f2f' points='1600 460 0 760 0 650 1600 350'/%3E%3Cpolygon fill='%23161b28' points='1600 800 0 800 0 750 1600 450'/%3E%3C/g%3E%3C/svg%3E");
background-attachment: fixed;
background-size: cover;
 */
