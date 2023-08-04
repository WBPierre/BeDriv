import React, {useContext, useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, Text, View, StyleSheet, Linking} from 'react-native';
import {Avatar, Button, Divider, Rating} from 'react-native-elements';
import TouchableNativeFeedback from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons';
import auth from '@react-native-firebase/auth';
import {
    DrawerContentScrollView,
    DrawerItemList,
} from '@react-navigation/drawer';
import DrawerBackground from '../theme/DrawerBackground';
import DrawerItem from '@react-navigation/drawer/src/views/DrawerItem';
import {UserContext} from '../Context/UserContext';
import I18n from "../../utils/i18n";


function CustomDrawer(props){
    const context = useContext(UserContext);

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
                            uri: context.user.data().picture}} />
                        <Text style={{ color: '#f9f9f9', marginTop: '3%' }}>{I18n.t('userDrawer.hi')} {context.user.data().given_name + " "+context.user.data().family_name}</Text>
                        {context.user.data().rate !== 0 ? (
                            <Button title={parseFloat(context.user.data().rate).toFixed(2)} disabledTitleStyle={{color:'#fff'}} type="clear" icon={{
                                name: "star",
                                size: 15,
                                color: "white"
                            }}
                            iconRight disabled></Button>
                        ):(
                            <Text style={{ color: '#f9f9f9', marginTop: '3%' }}>{I18n.t('userDrawer.newUser')}</Text>
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
                    {context.user.data().driver === null || (context.user.data().driver !== null && context.user.data().driver.status !== "ACCEPTED" && !context.user.data().driver.status.active) ? (
                        <DrawerItem
                            label={I18n.t('userDrawer.becomeADriver')}
                            labelStyle={styles.labelStyle}
                            onPress={() => Linking.openURL('https://bedriv.com')}
                        />
                    ):(
                        <DrawerItem
                            label={I18n.t('userDrawer.startDriving')}
                            labelStyle={styles.labelStyle}
                            onPress={() => props.navigation.navigate('Driver')}
                        />
                    )}
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
export default CustomDrawer;
