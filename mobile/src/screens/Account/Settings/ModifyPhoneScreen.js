import React, {createRef, useContext, useState} from 'react';
import Background from '../../../components/theme/Background';
import DrawerButton from '../../../components/Buttons/DrawerButton';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Avatar, Input, ListItem} from 'react-native-elements';
import PhoneInput from 'react-native-phone-input';
import BackArrow from '../../../components/Buttons/BackArrow';
import ScreenTitle from '../../../components/theme/ScreenTitle';
import {UserContext} from '../../../components/Context/UserContext';
import I18n from '../../../utils/i18n';


function ModifyPhoneScreen({navigation}){

    const context = useContext(UserContext);
    const phoneRef = createRef();
    const initialValue = context.user.data().phone_number;
    const [disable, setDisable] = useState(true);
    const [phone, setPhone] = useState(context.user.data().phone_number);
    const [phoneErrorMessage, setPhoneErrorMessage] = useState("");

    const phoneChange = (phone) => {
        if(phone !== initialValue){
            setDisable(false);
        }
        setPhone(phone);
        setPhoneErrorMessage("");
    }

    const verifyPhone = () => {
        let phone = phoneRef.current.getValue();
        if (phoneRef.current.getISOCode() === 'fr') {
            if (phone.length !== 12) {
                setPhoneErrorMessage(I18n.t('settings.phoneValidation.phoneErrorMessage'))
                return;
            }
        }
        navigation.navigate('PhoneValidation', {phone:phone});
    }

    return(
        <View style={styles.container}>
            <Background/>
            <BackArrow navigation={navigation}/>
            <ScreenTitle title={I18n.t('settings.phoneValidation.title')}/>
            <View style={styles.inputContainer}>
                <View>
                    <PhoneInput
                        ref={phoneRef}
                        cancelText={I18n.t('utils.cancel')}
                        confirmText={I18n.t('utils.confirm')}
                        initialCountry={'fr'}
                        onChangePhoneNumber={(phone)=>phoneChange(phone)}
                        textProps={{label:I18n.t('settings.phoneValidation.phone'), labelStyle:{color:'#B5DAE6'}, errorMessage:phoneErrorMessage}}
                        textComponent={Input}
                        autoFormat={true}
                        countriesList={require('../../../utils/acceptedCountries.json')}
                        textStyle={styles.inputStyle}
                        initialValue={phone}
                    />
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={verifyPhone} disabled={disable}>
                        <View style={[styles.buttonView, { opacity: disable ? 0.5 : 1}]}>
                            <View style={styles.buttonTextView}>
                                <Text style={styles.buttonTextStyle}>{I18n.t('utils.confirm')}</Text>
                            </View>
                        </View>

                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1
    },
    containerTop:{
        flex:1,
        justifyContent: 'center',
        alignItems:'center'
    },
    inputContainer: {
        flex:3,
        flexDirection:'column',
        marginHorizontal:20
    },
    inputStyle:{
        color:'#fff'
    },
    buttonContainer:{
        flex:1,
        margin:20,
        justifyContent: 'flex-end',
        marginBottom: '20%'
    },
    buttonRowContainer:{
        flex:1,
        flexDirection: 'row',
        justifyContent:'center'
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

export default ModifyPhoneScreen;
