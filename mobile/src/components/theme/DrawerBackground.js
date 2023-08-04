import React from 'react';
import Svg, {Circle, Defs, G, LinearGradient, Polygon, RadialGradient, Rect, Stop} from 'react-native-svg';
import {StyleSheet, View} from 'react-native';

function DrawerBackground(){
    return(
        <View style={styles.container}>
            <Svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%' viewBox='0 0 100 100' preserveAspectRatio="none">
                <Rect fill='#283149' width='100%' height='100%'/>
                <Defs>
                    <LinearGradient id='a' gradientUnits='userSpaceOnUse' x1='0' x2='0' y1='0' y2='50%'>
                        <Stop offset='0' stopColor='#161b28'/>
                        <Stop offset='1' stopColor='#161b28'/>
                    </LinearGradient>
                    <LinearGradient id='b' gradientUnits='userSpaceOnUse' x1='0' y1='0' x2='0' y2='50%'>
                        <Stop offset='0' stopColor='#3a476a' stopOpacity='0'/>
                        <Stop offset='1' stopColor='#161b28' stopOpacity='1'/>
                    </LinearGradient>
                    <LinearGradient id='c' gradientUnits='userSpaceOnUse' x1='0' y1='0' x2='100%' y2='100%'>
                        <Stop offset='0' stopColor='#3a476a' stopOpacity='0'/>
                        <Stop offset='1' stopColor='#161b28' stopOpacity='1'/>
                    </LinearGradient>
                </Defs>
                <Rect x='0' y='0' fill='url(#a)' width='100%' height='100%'/>
                <G fill-opacity='0.5'>
                    <Polygon fill='url(#b)' points='0 100 0 0 100 0'/>
                    <Polygon fill='url(#c)' points='100 100 100 0 0 0'/>
                </G>
            </Svg>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width:'100%',
        height:'100%',
        position:'absolute',
        backgroundColor:'orange'
    },
});
export default DrawerBackground;
