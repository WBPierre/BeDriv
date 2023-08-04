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
import DriveScreen from '../screens/Orders/DriveScreen';

const Stack = createStackNavigator();

function AppNavigator(){
    const context = useContext(UserContext);
    return(
        <NavigationContainer>

            <Stack.Navigator
                initialRouteName="Splash"
                screenOptions={{headerShown: false}}>
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="AccountCreation" component={AccountCreationScreen}/>
                <Stack.Screen name="PhoneValidation" component={PhoneValidationScreen}/>
                <Stack.Screen name="Home" component={DrawerNavigator}/>
                <Stack.Screen name="Destination" component={DestinationScreen}/>
                <Stack.Screen name="OrderConfirmation" component={ConfirmationScreen}/>
                <Stack.Screen name="WaitingDriver" component={WaitingScreen}/>
                <Stack.Screen name="Drive" component={DriveScreen}/>
            </Stack.Navigator>
        </NavigationContainer>
        )
}

export default AppNavigator;
