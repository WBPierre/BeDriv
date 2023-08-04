import React, {useContext, useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {Input, Overlay, Tooltip} from 'react-native-elements';
import Background from '../../../components/theme/Background';
import firestore from '@react-native-firebase/firestore';
import ScreenTitle from '../../../components/theme/ScreenTitle';
import BackArrow from '../../../components/Buttons/BackArrow';
import auth, {firebase} from '@react-native-firebase/auth';
import {UserContext} from '../../../components/Context/UserContext';
import I18n from "../../../utils/i18n";



function EmailValidationScreen({route, navigation}){
    const context = useContext(UserContext);
    const {email} = route.params;
    let interval = null;

    useEffect(() => {
        interval = setInterval(async ()=> {
            if(isEmailVerified()){
                await verifiedEmail();
            }
        }, 5000);
    })

    const isEmailVerified = () => {
        return true;
    }

    const verifiedEmail = async () => {
        const {currentUser} = firebase.auth();
        /**
         * Utils set for API
         */
        //setErrorMessage("Wrong identification code")

        clearInterval(interval);
        await firestore()
            .collection('users')
            .doc(currentUser.uid)
            .update({
                email: email,
                email_verified: true,
                update_time: firestore.FieldValue.serverTimestamp(),
            })
            .then(() => {
                context.user.data().email = email;
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Settings' }]
                })
            })
    }

    return(
        <View style={styles.container}>
            <Background/>
            <BackArrow navigation={navigation}/>
            <ScreenTitle title={I18n.t('settings.emailValidation.titleValidation')} subtitle={I18n.t('settings.emailValidation.subTitleValidation')+email}/>
            <View style={styles.inputContainer}>
                <Text style={styles.infoTextStyle}>{I18n.t('settings.emailValidation.waitingConfirmation')}</Text>
                <ActivityIndicator/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    containerTop:{
        flex:1,
        justifyContent: 'center',
        alignItems:'center'
    },
    inputContainer: {
        flex:3,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginHorizontal:20
    },
    inputStyle:{
        color:'#fff',
        fontSize:18
    },
    labelStyle:{
        color:'#B5DAE6'
    },
    overlayView:{
        padding:20,
    },
    infoTextStyle:{
        fontSize:18,
        fontFamily: 'Nunito-Regular',
        fontWeight:'500',
        color:'#fff'
    }
});

export default EmailValidationScreen;
