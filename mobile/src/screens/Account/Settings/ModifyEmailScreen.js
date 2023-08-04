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


function ModifyEmailScreen({navigation}){

    const context = useContext(UserContext);
    const phoneRef = createRef();
    const initialValue = context.user.data().email;
    const [disable, setDisable] = useState(true);
    const [isVerified, setIsVerified] = useState(context.user.data().email_verified);
    const [email, setEmail] = useState(context.user.data().email);
    const [emailErrorMessage, setEmailErrorMessage] = useState("");

    const emailChange = (email) => {
        if(email !== initialValue) setDisable(false);
        if(email === initialValue) setDisable(true);
        setEmail(email.toLowerCase());
        setEmailErrorMessage("");
    }

    const validate = (email) => {
        const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
        return expression.test(String(email).toLowerCase());
    }

    const verifyEmail = () => {
        if(validate(email)){
            navigation.navigate('EmailValidation', {email:email});
        }else{
            setEmailErrorMessage(I18n.t('settings.emailValidation.emailErrorMessage'))
        }
        //
    }

    return(
        <View style={styles.container}>
            <Background/>
            <BackArrow navigation={navigation}/>
            <ScreenTitle title={I18n.t('settings.emailValidation.title')}/>
            <View style={styles.inputContainer}>
                <View>
                    <Input
                        label={I18n.t('settings.emailValidation.email')}
                        onChangeText={emailChange}
                        value={email}
                        inputStyle={styles.inputStyle}
                        labelStyle={styles.labelStyle}
                        errorMessage={emailErrorMessage}
                    />
                    <TouchableOpacity onPress={verifyEmail} disabled={isVerified}>
                        <View style={[styles.buttonView, { opacity: isVerified ? 0 : 1}]}>
                            <View style={styles.buttonTextView}>
                                <Text style={styles.buttonTextStyle}>{I18n.t('settings.emailValidation.sendAVerificationEmail')}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={verifyEmail} disabled={disable}>
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
    labelStyle:{
        color:'#B5DAE6'
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
    },

});

export default ModifyEmailScreen;
