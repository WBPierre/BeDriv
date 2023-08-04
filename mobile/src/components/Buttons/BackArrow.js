import React from 'react';
import {StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import {Button, Icon} from 'react-native-elements';

function BackArrow({navigation}){
    return(
        <View style={styles.container}>
            <TouchableWithoutFeedback onPress={navigation.goBack}>
                <View style={styles.arrowContainer}>
                    <Icon
                        name='arrow-back-outline'
                        type="ionicon"
                        color='black' />
                </View>
            </TouchableWithoutFeedback>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position:'absolute',
        top:'5%',
        left:'5%',
        zIndex:2
    },
    arrowContainer:{
        backgroundColor: 'white',
        padding:10,
        borderRadius:50,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.4,
        elevation:9,
    }
});

export default BackArrow;
