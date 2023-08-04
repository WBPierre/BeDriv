import React, {useContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {UserContext} from '../components/Context/UserContext';
import HelpScreen from '../screens/Account/Support/HelpScreen';
import SupportScreen from '../screens/Account/Support/SupportScreen';
import NeedSupportScreen from '../screens/Account/Support/NeedSupportScreen';

const Stack = createStackNavigator();

function SupportNavigator(){
    const context = useContext(UserContext);
    return(
        <Stack.Navigator
            initialRouteName="SupportCenter"
            screenOptions={{headerShown: false}}>
            <Stack.Screen name="SupportCenter" component={HelpScreen} />
            <Stack.Screen name="ExchangeMessage" component={SupportScreen} />
            <Stack.Screen name="CreateTicket" component={NeedSupportScreen} />
        </Stack.Navigator>
    )
}

export default SupportNavigator;
