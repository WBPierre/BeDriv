import React, {useContext, useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {Input, Overlay, Tooltip} from 'react-native-elements';
import Background from '../../../components/theme/Background';
import firestore from '@react-native-firebase/firestore';
import ScreenTitle from '../../../components/theme/ScreenTitle';
import BackArrow from '../../../components/Buttons/BackArrow';
import auth, {firebase} from '@react-native-firebase/auth';
import {UserContext} from '../../../components/Context/UserContext';
import I18n from '../../../utils/i18n';



function PhoneValidationScreen({route, navigation}){
    const context = useContext(UserContext);
    const {phone} = route.params;

    const [phoneCode, setPhoneCode] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);

    const onPhoneChange = async (code) => {
        setErrorMessage("");
        setPhoneCode(code);
        if(code.length === 5){
            const {currentUser} = firebase.auth();
            /**
             * Utils set for API
             */
            //setErrorMessage("Wrong identification code")

            await firestore()
                .collection('users')
                .doc(currentUser.uid)
                .update({
                    phone_number: phone,
                    phone_verified: true,
                    update_time: firestore.FieldValue.serverTimestamp(),
                })
                .then(() => {
                    context.user.data().phone_number = phone;
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Settings' }]
                    })
                })
        }
    }

    return(
        <View style={styles.container}>
            <Background/>
            <BackArrow navigation={navigation}/>
            <ScreenTitle title={I18n.t('settings.phoneValidation.titleValidation')} subtitle={I18n.t('settings.phoneValidation.subTitleValidation')}/>
            <View style={styles.inputContainer}>
                <Input
                    label={I18n.t('settings.phoneValidation.phoneCode')}
                    value={phoneCode}
                    keyboardType="phone-pad"
                    onChangeText={code => onPhoneChange(code)}
                    textAlign={'center'}
                    inputStyle={styles.inputStyle}
                    labelStyle={styles.labelStyle}
                    errorMessage={errorMessage}
                />
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
    overlayTextStyle:{
        fontSize:18,
        fontFamily: 'Nunito-Regular',
        fontWeight:'500'
    }
});

export default PhoneValidationScreen;
