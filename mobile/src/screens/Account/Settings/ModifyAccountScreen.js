import React, {createRef, useContext, useState} from 'react';
import Background from '../../../components/theme/Background';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Avatar, Button, Input, ListItem} from 'react-native-elements';
import BackArrow from '../../../components/Buttons/BackArrow';
import parsePhoneNumber from 'libphonenumber-js';
import ScreenTitle from '../../../components/theme/ScreenTitle';
import {UserContext} from '../../../components/Context/UserContext';
import I18n from '../../../utils/i18n';
import BottomConfirmation from '../../../components/Overlays/BottomConfirmation';
import {StackActions as CommonActions} from 'react-navigation';


function ModifyAccountScreen({navigation}){
    const context = useContext(UserContext);
    const [visible, setVisible] = useState(false);

    const showHelper = () => {
        setVisible(true);
    }

    const goToSupport = () => {
        setVisible(false);
        navigation.navigate('Home', { screen: I18n.t('help.title') });
    }

    return(
        <View style={styles.container}>
            <Background/>
            <BackArrow navigation={navigation}/>
            <ScreenTitle title={I18n.t('settings.modifyYourAccount.yourAccount')}/>
            <View style={styles.inputContainer}>
                <TouchableOpacity onPress={showHelper}>
                    <ListItem bottomDivider>
                        <ListItem.Content>
                            <ListItem.Title style={styles.listLabelStyle}>{I18n.t('settings.modifyYourAccount.firstname')}</ListItem.Title>
                            <ListItem.Subtitle style={styles.listDataDisabledStyle}>{context.user.data().given_name}</ListItem.Subtitle>
                        </ListItem.Content>
                    </ListItem>
                </TouchableOpacity>
                <TouchableOpacity onPress={showHelper}>
                    <ListItem bottomDivider>
                        <ListItem.Content>
                            <ListItem.Title style={styles.listLabelStyle}>{I18n.t('settings.modifyYourAccount.lastname')}</ListItem.Title>
                            <ListItem.Subtitle style={styles.listDataDisabledStyle}>{context.user.data().family_name}</ListItem.Subtitle>
                        </ListItem.Content>
                    </ListItem>
                </TouchableOpacity>
                <ListItem bottomDivider onPress={() => navigation.navigate('ModifyPhone')}>
                    <ListItem.Content>
                        <ListItem.Title style={styles.listLabelStyle}>{I18n.t('settings.modifyYourAccount.phone')}</ListItem.Title>
                        <ListItem.Subtitle style={styles.listDataStyle}>{parsePhoneNumber(context.user.data().phone_number).formatInternational()}</ListItem.Subtitle>
                    </ListItem.Content>
                    <ListItem.Subtitle style={[styles.listLabelStyle, {color: context.user.data().phone_verified ? 'green' : 'red'}]}>{I18n.t('settings.modifyYourAccount.verified')}</ListItem.Subtitle>
                    <ListItem.Chevron />
                </ListItem>
                <ListItem onPress={() => navigation.navigate('ModifyEmail')}>
                    <ListItem.Content>
                        <ListItem.Title style={styles.listLabelStyle}>{I18n.t('settings.modifyYourAccount.email')}</ListItem.Title>
                        <ListItem.Subtitle style={styles.listDataStyle}>{context.user.data().email}</ListItem.Subtitle>
                    </ListItem.Content>
                    <ListItem.Subtitle style={[styles.listLabelStyle, {color: context.user.data().email_verified ? 'green' : 'red'}]}>{I18n.t('settings.modifyYourAccount.verified')}</ListItem.Subtitle>
                    <ListItem.Chevron />
                </ListItem>
                <BottomConfirmation isVisible={visible} title={<Button title={I18n.t('settings.modifyYourAccount.supportRequest')} disabledTitleStyle={{color:'#fff'}} type="clear" disabled/>}>
                    <View style={styles.bottonConfirmationButtonsView}>
                        <Button title={I18n.t('utils.confirm')} type="clear" onPress={goToSupport}/>
                    </View>
                </BottomConfirmation>
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
        flexDirection:'column',
        marginHorizontal:20
    },
    listLabelStyle:{
        fontFamily: 'Nunito-Regular',
        fontSize:14,
        opacity:0.5
    },
    listDataStyle:{
        fontFamily: 'Nunito-Regular',
        fontSize:18,
    },
    listDataDisabledStyle:{
        fontFamily: 'Nunito-Regular',
        fontSize:18,
        opacity:0.5
    },
});

export default ModifyAccountScreen;
