import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import HomeDriverScreen from '../screens/Driver/HomeDriverScreen';
import DrawerNavigator from './DrawerNavigator';
import CustomDrawer from '../components/navigation/CustomDrawer';
import DriverDrawer from '../components/navigation/DriverDrawer';
import StatsScreen from '../screens/Driver/StatsScreen';
import HistoryScreen from '../screens/Driver/HistoryScreen';
import I18n from '../utils/i18n';
import DriveNavigator from './DriveNavigator';

const Drawer = createDrawerNavigator();

function DriverNavigator(){

    return (
        <Drawer.Navigator
            initialRouteName="Home"
            screenOptions={{headerShown: false}}
            drawerContent={(props)=><DriverDrawer {...props}/>}>
            <Drawer.Screen name={I18n.t('driver.home.title')} component={DriveNavigator}/>
            <Drawer.Screen name={I18n.t('driver.stats.title')} component={StatsScreen}/>
            <Drawer.Screen name={I18n.t('driver.history.title')} component={HistoryScreen}/>
            <Drawer.Screen name="UserInterface" component={DrawerNavigator}
                           options={{
                               drawerLabel: () => null,
                               title: null,
                               drawerIcon: () => null
                           }}
            />
        </Drawer.Navigator>
    )
}
export default DriverNavigator;
