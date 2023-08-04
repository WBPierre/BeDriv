import React, {useState} from 'react';
import {BottomSheet, ListItem} from 'react-native-elements';
import {View, StyleSheet, Text} from 'react-native';

function BottomConfirmation(props){

    return (
        <BottomSheet
            isVisible={props.isVisible}
            containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)', flex:1 }}
        >
            <View style={styles.innerContainer}>
                <View style={styles.titleContainer}>
                    <Text style={styles.titleStyle}>{props.title}</Text>
                </View>
                <View style={styles.childrenView}>
                    {props.children}
                </View>
            </View>
        </BottomSheet>
    )
}
const styles=StyleSheet.create({
    homeContainer:{
        flex:1
    },
    innerContainer:{
        flex:1,
        backgroundColor: '#283149',
        borderRadius:30,
        paddingTop: 30
    },
    titleContainer:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    titleStyle:{
        fontSize: 18,
        fontWeight: '500',
        fontFamily: 'Nunito-Regular',
        color:'#fff'
    },
    childrenView:{
        flex:5,
        flexDirection:'column',
        margin:20
    }
})

export default BottomConfirmation;
