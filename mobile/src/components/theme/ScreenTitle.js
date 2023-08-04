import React from 'react';
import {Text, View, StyleSheet} from 'react-native';


function ScreenTitle(props){
    return (
        <View style={styles.container}>
            {
                props.title !== null &&
                <Text style={styles.screenTitleStyle}>{props.title}</Text>
            }
            {
                props.subtitle !== null &&
                <Text style={styles.screenTitleSubText}>{props.subtitle}</Text>
            }

        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent: 'center',
        alignItems:'center'
    },
    screenTitleStyle:{
        fontFamily: 'Nunito-Regular',
        color:'#fff',
        fontSize:24,
        fontWeight:'800'
    },
    screenTitleSubText:{
        fontFamily: 'Nunito-Regular',
        color:'#fff',
        fontSize:14,
        fontWeight:'600',
        textAlign:'center'
    },
})

export default ScreenTitle;
