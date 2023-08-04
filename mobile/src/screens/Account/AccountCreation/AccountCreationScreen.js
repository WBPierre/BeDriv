import React, {createRef, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Button, Input} from 'react-native-elements';
import PhoneInput from 'react-native-phone-input';
import Background from '../../../components/theme/Background';
import ScreenTitle from '../../../components/theme/ScreenTitle';
import I18n from '../../../utils/i18n';

function AccountCreationScreen({route, navigation}){

    const {user} = route.params;
    const phoneRef = createRef();
    const [givenName, setGivenName] = useState(user.given_name);
    const [givenNameErrorMessage, setGivenNameErrorMessage] = useState("");
    const [familyName, setFamilyName] = useState(user.family_name);
    const [familyNameErrorMessage, setFamilyNameErrorMessage] = useState("");
    const [phone, setPhone] = useState("");
    const [phoneErrorMessage, setPhoneErrorMessage] = useState("");

    const createAccount = () => {
        if(givenName.length === 0){
            setGivenNameErrorMessage(I18n.t('login.accountCreation.givenNameErrorMessage'));
        }
        if(familyName.length === 0){
            setFamilyNameErrorMessage(I18n.t('login.accountCreation.familyNameErrorMessage'));
        }
        let phone = phoneRef.current.getValue();
        if(phoneRef.current.getISOCode() === 'fr'){
            if(phone.length !== 12){
                setPhoneErrorMessage(I18n.t('login.accountCreation.phoneErrorMessage'))
                return;
            }
        }
        const userModified = {
            uid: user.uid,
            given_name : givenName,
            family_name : familyName,
            email: user.email,
            emailVerified: user.emailVerified,
            picture: user.picture,
            phone: phone,
            locale: user.locale,
        }
        navigation.navigate('PhoneValidation', {user : userModified});
    }

    const givenNameChange = (text) => {
        setGivenNameErrorMessage("");
        setGivenName(text);
    }

    const familyNameChange = (text) => {
        setFamilyName(text);
        setFamilyNameErrorMessage("");
    }

    const phoneChange = (phone) => {
        setPhone(phone);
        setPhoneErrorMessage("");
    }



    return(
        <View style={styles.container}>
            <Background/>
            <ScreenTitle title={I18n.t('login.accountCreation.title')} subtitle={I18n.t('login.accountCreation.subTitle')}/>
            <View style={styles.inputContainer}>
                <Input
                    label={I18n.t('login.accountCreation.email')}
                    value={user.email}
                    disabled={true}
                    inputStyle={styles.inputStyle}
                    labelStyle={styles.labelStyle}
                />
                <Input
                    label={I18n.t('login.accountCreation.firstname')}
                    value={givenName}
                    onChangeText={(text) => givenNameChange(text)}
                    inputStyle={styles.inputStyle}
                    labelStyle={styles.labelStyle}
                    errorMessage={givenNameErrorMessage}
                />
                <Input
                    label={I18n.t('login.accountCreation.lastname')}
                    value={familyName}
                    onChangeText={(text) => familyNameChange(text)}
                    inputStyle={styles.inputStyle}
                    labelStyle={styles.labelStyle}
                    errorMessage={familyNameErrorMessage}
                />
                <View>
                    <PhoneInput
                        ref={phoneRef}
                        cancelText={I18n.t('utils.cancel')}
                        confirmText={I18n.t('utils.confirm')}
                        initialCountry={'fr'}
                        onChangePhoneNumber={(phone)=>phoneChange(phone)}
                        textProps={{label:I18n.t('login.accountCreation.phone'), labelStyle:{color:'#B5DAE6'}, errorMessage:phoneErrorMessage}}
                        textComponent={Input}
                        autoFormat={true}
                        countriesList={require('../../../utils/acceptedCountries.json')}
                        textStyle={styles.inputStyle}
                    />
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={createAccount} >
                    <View style={styles.buttonView}>
                        <View style={styles.buttonTextView}>
                            <Text style={styles.buttonTextStyle}>{I18n.t('login.accountCreation.createAccount')}</Text>
                        </View>
                    </View>

                </TouchableOpacity>
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
        flex:2,
        flexDirection:'column',
        justifyContent: 'space-evenly',
        marginHorizontal:20
    },
    buttonContainer:{
        flex:1,
        margin:20,
        justifyContent: 'flex-end',
        marginBottom: '20%'
    },
    inputStyle:{
        color:'#fff'
    },
    labelStyle:{
        color:'#B5DAE6'
    },
    buttonView:{
        backgroundColor: '#fff',
        flexDirection: 'row',
        padding:10,
        borderRadius:10
    },
    buttonTextView:{
        flex:3,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonTextStyle:{
        fontFamily: 'Nunito-Regular',
        color: '#3A476A',
        fontWeight:'500',
        fontSize: 18
    }
});

export default AccountCreationScreen;
