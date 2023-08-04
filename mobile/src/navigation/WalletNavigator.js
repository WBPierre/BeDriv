import React, {useContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {UserContext} from '../components/Context/UserContext';
import WalletScreen from '../screens/Account/Wallet/WalletScreen';
import WalletAddressScreen from '../screens/Account/Wallet/WalletAddressScreen';
import AddCardScreen from '../screens/Account/Wallet/AddCardScreen';
import SeeCardScreen from '../screens/Account/Wallet/SeeCardScreen';

const Stack = createStackNavigator();

function WalletNavigator(){
    const context = useContext(UserContext);
    return(
        <Stack.Navigator
            initialRouteName="WalletCenter"
            screenOptions={{headerShown: false}}>
            <Stack.Screen name="WalletCenter" component={WalletScreen} />
            <Stack.Screen name="PublicKey" component={WalletAddressScreen} />
            <Stack.Screen name="AddACard" component={AddCardScreen} />
            <Stack.Screen name="SeeACard" component={SeeCardScreen} />
        </Stack.Navigator>
    )
}

export default WalletNavigator;
