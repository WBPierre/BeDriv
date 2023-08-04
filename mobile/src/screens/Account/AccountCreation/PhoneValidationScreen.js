import React, {useContext, useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {Input, Overlay, Tooltip} from 'react-native-elements';
import Background from '../../../components/theme/Background';
import firestore from '@react-native-firebase/firestore';
import ScreenTitle from '../../../components/theme/ScreenTitle';
import {UserContext} from '../../../components/Context/UserContext';
import I18n from "../../../utils/i18n";
import messaging from '@react-native-firebase/messaging';


function PhoneValidationScreen({route, navigation}){

    const {user} = route.params;
    const context = useContext(UserContext);
    const [phoneCode, setPhoneCode] = useState("");
    const [visible, setVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    const toggleOverlay = () => {
        setVisible(!visible);
    };

    const onPhoneChange = async (code) => {
        setErrorMessage("");
        setPhoneCode(code);
        if(code.length === 5){
            /**
             * Utils set for API
             */
            //setErrorMessage(I18n.t('login.accountConfirmation.codeErrorMessage'))
            //setVisible(true);
            const token = await messaging().getToken();
            const userData = {
                    email: user.email,
                    email_verified: user.emailVerified,
                    given_name: user.given_name,
                    family_name: user.family_name,
                    phone_number: user.phone,
                    phone_verified: true,
                    picture: user.picture,
                    locale: user.locale,
                    addresses: {"home":{}, "professional":{}},
                    driver: null,
                    rate: 0,
                    number_rate: 0,
                    drive_status:false,
                    device_token:token,
                    balance: 0,
                    public_key:null,
                    notes: "",
                    creation_time: firestore.FieldValue.serverTimestamp(),
                    update_time: firestore.FieldValue.serverTimestamp(),
                }
            await firestore()
                .collection('users')
                .doc(user.uid)
                .set(userData)
            context.updateUser(await firestore().collection("users").doc(user.uid).get());
            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }]
            })

        }
    }

    return(
        <View style={styles.container}>
            <Background/>
            <ScreenTitle title={I18n.t('login.accountConfirmation.title')} subtitle={I18n.t('login.accountConfirmation.subTitle')}/>
            <View style={styles.inputContainer}>
                <Input
                    label={I18n.t('login.accountConfirmation.code')}
                    value={phoneCode}
                    keyboardType="phone-pad"
                    onChangeText={code => onPhoneChange(code)}
                    textAlign={'center'}
                    inputStyle={styles.inputStyle}
                    labelStyle={styles.labelStyle}
                    errorMessage={errorMessage}
                />
            </View>
            <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
                <View style={styles.overlayView}>
                    <Text style={styles.overlayTextStyle}>{I18n.t('login.accountConfirmation.accountWaitingCreation')}</Text>
                    <ActivityIndicator />
                </View>
            </Overlay>
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
