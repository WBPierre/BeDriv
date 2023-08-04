import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SettingsScreen from '../screens/Account/Settings/SettingsScreen';
import ModifyAccountScreen from '../screens/Account/Settings/ModifyAccountScreen';
import ModifyPhoneScreen from '../screens/Account/Settings/ModifyPhoneScreen';
import PhoneValidationScreen from '../screens/Account/Settings/PhoneValidationScreen';
import ModifyEmailScreen from '../screens/Account/Settings/ModifyEmailScreen';
import EmailValidationScreen from '../screens/Account/Settings/EmailValidationScreen';
import AddressScreen from '../screens/Account/Settings/AddressScreen';
import ConfidentialityScreen from '../screens/Account/Settings/ConfidentialityScreen';

const Stack = createStackNavigator();

function SettingsNavigator(){
    return(
        <Stack.Navigator
            initialRouteName="Settings"
            screenOptions={{headerShown: false}}>
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="ModifyAccount" component={ModifyAccountScreen} />
            <Stack.Screen name="ModifyPhone" component={ModifyPhoneScreen} />
            <Stack.Screen name="PhoneValidation" component={PhoneValidationScreen} />
            <Stack.Screen name="ModifyEmail" component={ModifyEmailScreen} />
            <Stack.Screen name="EmailValidation" component={EmailValidationScreen} />
            <Stack.Screen name="Address" component={AddressScreen} />
            <Stack.Screen name="Confidentiality" component={ConfidentialityScreen} />
        </Stack.Navigator>
    )
}

export default SettingsNavigator;
