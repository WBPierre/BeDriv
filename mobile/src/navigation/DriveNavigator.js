import React, {useContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from '../screens/Login/LoginScreen';
import AccountCreationScreen from '../screens/Account/AccountCreation/AccountCreationScreen';
import PhoneValidationScreen from '../screens/Account/AccountCreation/PhoneValidationScreen';
import HomeScreen from '../screens/HomeScreen';
import DestinationScreen from '../screens/Orders/DestinationScreen';
import ConfirmationScreen from '../screens/Orders/ConfirmationScreen';
import WaitingScreen from '../screens/Orders/WaitingScreen';
import DrawerNavigator from './DrawerNavigator';
import SplashScreen from '../screens/SplashScreen';
import {UserContext} from '../components/Context/UserContext';
import DriveScreen from '../screens/Driver/DriveScreen';
import HomeDriverScreen from '../screens/Driver/HomeDriverScreen';

const Stack = createStackNavigator();

function DriveNavigator(){
    const context = useContext(UserContext);
    return(
        <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{headerShown: false}}>
            <Stack.Screen name="Home" component={HomeDriverScreen} />
            <Stack.Screen name="Drive" component={DriveScreen} />
        </Stack.Navigator>
    )
}

export default DriveNavigator;
