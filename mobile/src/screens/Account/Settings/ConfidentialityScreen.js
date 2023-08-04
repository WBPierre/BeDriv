import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import ScreenTitle from '../../../components/theme/ScreenTitle';
import BackArrow from '../../../components/Buttons/BackArrow';
import Background from '../../../components/theme/Background';
import {ListItem} from 'react-native-elements';
import {checkNotifications, PERMISSIONS, requestNotifications, request} from 'react-native-permissions';
import {set} from 'react-native-reanimated';
import {UserContext} from '../../../components/Context/UserContext';
import I18n from "../../../utils/i18n";
import messaging from '@react-native-firebase/messaging';

function ConfidentialityScreen({navigation}){
    const context = useContext(UserContext);
    const [notificationStatus, setNotificationStatus] = useState();
    const [locationStatus, setLocationStatus] = useState();


    useEffect(() => {
        checkNotifications().then(({status, settings}) => {
            if(status === 'granted') {
                setNotificationStatus("granted")
            }
        });
        request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then((result) => {
            if(result === "granted"){
                setLocationStatus("granted");
            }
        });
    }, []);


    const askPermissionNotifications = () => {
        requestNotifications(['alert', 'sound', 'notificationCenter']).then(({status, settings}) => {
            if(status === 'granted'){
                setNotificationStatus("granted")
           }
        });
    }

    const askPermissionLocation = () => {
        request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then((result) => {
            if(result === "granted"){
                setLocationStatus("granted");
            }
        });
    }



    return(
        <View style={styles.container}>
            <Background/>
            <BackArrow navigation={navigation}/>
            <ScreenTitle title={I18n.t('settings.confidentiality.title')}/>
            <View style={styles.containerForm}>
                <TouchableOpacity onPress={askPermissionNotifications}>
                    <ListItem bottomDivider>
                        <ListItem.Content>
                            <ListItem.Title style={styles.listLabelStyle}>{I18n.t('settings.confidentiality.notifications')}</ListItem.Title>
                        </ListItem.Content>
                        <ListItem.Subtitle style={[styles.listLabelStyle, {color: notificationStatus === "granted" ? 'green' : 'red'}]}>{notificationStatus === "granted" ? I18n.t('settings.confidentiality.granted') : I18n.t('settings.confidentiality.ungranted')}</ListItem.Subtitle>
                    </ListItem>
                </TouchableOpacity>
                <TouchableOpacity onPress={askPermissionLocation}>
                    <ListItem bottomDivider>
                        <ListItem.Content>
                            <ListItem.Title style={styles.listLabelStyle}>{I18n.t('settings.confidentiality.position')}</ListItem.Title>
                        </ListItem.Content>
                        <ListItem.Subtitle style={[styles.listLabelStyle, {color: locationStatus === "granted" ? 'green' : 'red'}]}>{notificationStatus === "granted" ? I18n.t('settings.confidentiality.granted') : I18n.t('settings.confidentiality.ungranted')}</ListItem.Subtitle>
                    </ListItem>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
    },
    containerForm:{
        flex:3,
        flexDirection:'column',
    },
    listLabelStyle:{
        fontFamily: 'Nunito-Regular',
        fontSize:14,
        opacity:1
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
})

export  default ConfidentialityScreen;
