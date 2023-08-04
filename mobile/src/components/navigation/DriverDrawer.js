import React, {useContext, useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, Text, View, StyleSheet, Linking} from 'react-native';
import {Avatar, Button, Divider} from 'react-native-elements';
import TouchableNativeFeedback from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons';
import auth, {firebase} from '@react-native-firebase/auth';
import {
    DrawerContentScrollView,
    DrawerItemList,
} from '@react-navigation/drawer';
import DrawerBackground from '../theme/DrawerBackground';
import DrawerItem from '@react-navigation/drawer/src/views/DrawerItem';
import firestore from '@react-native-firebase/firestore';

import database from '@react-native-firebase/database';
import I18n from "../../utils/i18n";
import {UserContext} from '../Context/UserContext';

function DriverDrawer(props){
    const context = useContext(UserContext);


    const stopDriving = async () => {
        if(context.user.data().driver.online){
            const {currentUser} = firebase.auth();
            let driver = context.user.data().driver;
            driver.online = false;
            driver.available = false;
            context.user.data().driver = driver;
            await firestore().collection('users').doc(currentUser.uid).update({
                driver: driver
            });
            await database()
                .ref('/devices/'+currentUser.uid)
                .update({
                    active:false,
                    available: false,
                });
        }
        props.navigation.reset({
            index: 0,
            routes: [{ name: 'UserInterface' }]
        })
    }

    return (
        <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContent}>
            <DrawerBackground/>
            <SafeAreaView
                style={styles.container}
                forceInset={{ top: 'always', horizontal: 'never' }}
            >
                <View style={[ styles.containHeader]}>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Avatar size='large' rounded source={{
                            uri: context.user.data().picture }} />
                        <Text style={{ color: '#f9f9f9', marginTop: '3%' }}>{I18n.t('driver.drawer.hi')} { context.user.data().given_name + " "+context.user.data().family_name }</Text>
                        {context.user.data().rate !== 0 ? (
                            <Button title={parseFloat(context.user.data().rate).toFixed(2)} disabledTitleStyle={{color:'#fff'}} type="clear" icon={{
                                name: "star",
                                size: 15,
                                color: "white"
                            }}
                                    iconRight disabled></Button>
                        ):(
                            <Text style={{ color: '#f9f9f9', marginTop: '3%' }}>{I18n.t('driver.drawer.newDriver')}</Text>
                        )}
                    </View>
                    <View>
                        <View style={{ marginVertical: '10%' }}>
                            <Divider style={{ backgroundColor: '#777f7c90' }} />
                        </View>
                    </View>
                </View>

                <View style={styles.containLink}>
                    <DrawerItemList {...props} labelStyle={styles.labelStyle} itemStyle={styles.linkViewStyle} />
                </View>


                <View style={{ marginVertical: '5%' }}>
                    <Divider style={{ backgroundColor: '#777f7c90' }} />
                </View>

                <View style={styles.containFooter}>
                    <DrawerItem
                        label={I18n.t('driver.drawer.stopDriving')}
                        labelStyle={styles.labelStyle}
                        onPress={() => stopDriving()}
                    />
                </View>
            </SafeAreaView>
        </DrawerContentScrollView>
    );
}


const styles = StyleSheet.create({
    drawerContent:{
        flex:1,
        backgroundColor:'#161b28'
    },
    container: {
        flex: 1
    },
    containHeader: {
        flex:1
    },
    containLink:{
        flex:2
    },
    containFooter:{
        flex:2
    },
    labelStyle:{
        fontFamily: 'Nunito-Regular',
        color:'#fff',
        fontSize: 18
    },
    linkViewStyle:{
        backgroundColor: 'transparent'
    }
});
export default DriverDrawer;
