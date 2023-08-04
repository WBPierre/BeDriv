import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import HomeScreen from '../screens/HomeScreen';
import CustomDrawer from '../components/navigation/CustomDrawer';
import HistoryScreen from '../screens/Account/HistoryScreen';
import WalletScreen from '../screens/Account/Wallet/WalletScreen';
import SettingsNavigator from './SettingsNavigator';
import DriverNavigator from './DriverNavigator';
import I18n from '../utils/i18n';
import HelpScreen from '../screens/Account/Support/HelpScreen';
import SupportNavigator from './SupportNavigator';
import WalletNavigator from './WalletNavigator';

const Drawer = createDrawerNavigator();

function DrawerNavigator(){

    return (
        <Drawer.Navigator
            initialRouteName="Home"
            screenOptions={{headerShown: false}}
            drawerContent={(props)=><CustomDrawer {...props}/>}
        >
            <Drawer.Screen name={I18n.t('home.title')} component={HomeScreen}/>
            <Drawer.Screen name={I18n.t('history.title')} component={HistoryScreen}/>
            <Drawer.Screen name={I18n.t('wallet.title')} component={WalletNavigator}/>
            <Drawer.Screen name={I18n.t('help.title')} component={SupportNavigator}/>
            <Drawer.Screen name={I18n.t('settings.title')} component={SettingsNavigator}/>
            <Drawer.Screen name="Driver" component={DriverNavigator}
                           options={{
                                drawerLabel: () => null,
                                title: null,
                                drawerIcon: () => null
                           }}
            />
        </Drawer.Navigator>
    )
}
export default DrawerNavigator;
