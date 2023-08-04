import React, {useContext, useEffect, useState} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import Background from '../../../components/theme/Background';
import {Avatar, Icon, ListItem} from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import parsePhoneNumber from 'libphonenumber-js'
import DrawerButton from '../../../components/Buttons/DrawerButton';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import ScreenTitle from '../../../components/theme/ScreenTitle';
import {UserContext} from '../../../components/Context/UserContext';
import I18n from "../../../utils/i18n";
import {LoginManager} from 'react-native-fbsdk-next';


function SettingsScreen({navigation}){

    const context = useContext(UserContext);

    const logOut = async () => {
        await auth()
            .signOut()
            .then(async () => {
                if(context.firebaseUser.providerData[0].providerId.indexOf("facebook") !== -1){
                    try{
                        await LoginManager.logOut();
                    }catch (error){
                        console.log(error);
                    }
                }else{
                    try {
                        await GoogleSignin.revokeAccess();
                        await GoogleSignin.signOut();
                    } catch (error) {
                        console.error(error);
                    }
                }
                console.log('User signed out!');
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }]
                })
            });
    }

    return (
        <View style={styles.container}>
            <Background/>
            <DrawerButton navigation={navigation}/>
            <ScreenTitle title={I18n.t('settings.title')}/>
            <View style={styles.containerForm}>
                <TouchableOpacity onPress={() => navigation.navigate('ModifyAccount')}>
                    <View style={styles.profileContainer}>
                        <View style={styles.listTitleView}>
                            <Text style={styles.listTitle}>{I18n.t('settings.modifyYourAccount.title')}</Text>
                        </View>
                        <ListItem>
                            <Avatar rounded source={{
                                uri: context.user.data().picture}} />
                            <ListItem.Content>
                                <ListItem.Title>{context.user.data().given_name} {context.user.data().family_name}</ListItem.Title>
                                <ListItem.Subtitle>{parsePhoneNumber(context.user.data().phone_number).formatInternational()}</ListItem.Subtitle>
                                <ListItem.Subtitle>{context.user.data().email}</ListItem.Subtitle>
                            </ListItem.Content>
                            <ListItem.Chevron />
                        </ListItem>
                    </View>
                </TouchableOpacity>
                <View style={styles.addressContainer}>
                    <View style={styles.listTitleView}>
                        <Text style={styles.listTitle}>{I18n.t('settings.modifyYourAccount.favorites')}</Text>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate('Address', {type:0})}>
                        <ListItem bottomDivider>
                            <Icon name="home" type="font-awesome" />
                            {Object.keys(context.user.data().addresses.home).length !== 0 ?(
                                <ListItem.Content>
                                    <ListItem.Title>{I18n.t('settings.modifyYourAccount.home')}</ListItem.Title>
                                    <ListItem.Subtitle numberOfLines={1}>{context.user.data().addresses.home.description}</ListItem.Subtitle>
                                </ListItem.Content>
                            ) : (
                                <ListItem.Content>
                                    <ListItem.Title>{I18n.t('settings.modifyYourAccount.defineAHomeAddress')}</ListItem.Title>
                                </ListItem.Content>
                            )}
                            <ListItem.Chevron />
                        </ListItem>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Address', {type:1})}>
                        <ListItem>
                            <Icon name="suitcase" type="font-awesome" />
                            {Object.keys(context.user.data().addresses.professional).length !== 0 ?(
                                <ListItem.Content>
                                    <ListItem.Title>{I18n.t('settings.modifyYourAccount.professional')}</ListItem.Title>
                                    <ListItem.Subtitle numberOfLines={1}>{context.user.data().addresses.professional.description}</ListItem.Subtitle>
                                </ListItem.Content>
                            ) : (
                                <ListItem.Content>
                                    <ListItem.Title>{I18n.t('settings.modifyYourAccount.defineAProfessionalAddress')}</ListItem.Title>
                                </ListItem.Content>
                            )}
                            <ListItem.Chevron />
                        </ListItem>
                    </TouchableOpacity>
                </View>
                <View style={styles.bottomContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate('Confidentiality')}>
                        <ListItem>
                            <Icon name="user-shield" type="font-awesome-5" />
                            <ListItem.Content>
                                <ListItem.Title>{I18n.t('settings.confidentiality.title')}</ListItem.Title>
                                <ListItem.Subtitle>{I18n.t('settings.confidentiality.notifications')}, {I18n.t('settings.confidentiality.position')}</ListItem.Subtitle>
                            </ListItem.Content>
                            <ListItem.Chevron />
                        </ListItem>
                    </TouchableOpacity>
                </View>
                <View style={styles.bottomContainer}>
                    <TouchableOpacity onPress={logOut}>
                        <ListItem>
                            <ListItem.Content>
                                <ListItem.Title style={styles.logOutText}>{I18n.t('settings.logOut')}</ListItem.Title>
                            </ListItem.Content>
                        </ListItem>
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
    containerForm:{
        flex:3,
        flexDirection:'column',
    },
    profileContainer:{
        marginVertical:20
    },
    listTitleView:{
        justifyContent: 'flex-start',
    },
    listTitle:{
        fontFamily: 'Nunito-Regular',
        color:'#fff',
        fontSize:18,
        fontWeight:'600',
        paddingLeft:10
    },
    addressContainer: {
        marginVertical:30
    },
    bottomContainer:{
        marginVertical:20
    },
    logOutText:{
        fontFamily: 'Nunito-Regular',
        color:'red',
        fontSize:18,
    }
});

export default SettingsScreen;
