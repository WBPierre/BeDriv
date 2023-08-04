import React, {useEffect} from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import {FirebaseProvider} from './src/components/Context/UserContext';
import {Alert, LogBox, Platform, YellowBox} from 'react-native';
import messaging from '@react-native-firebase/messaging';


LogBox.ignoreLogs([
    // See: https://github.com/react-navigation/react-navigation/issues/7839
    'Sending \`onAnimatedValueUpdate\` with no listeners registered.',
]);

const App = () => {

    useEffect(() => {
        async function register(){
            if (
                Platform.OS === 'ios' &&
                !messaging().isDeviceRegisteredForRemoteMessages
            ) {
                await messaging().registerDeviceForRemoteMessages();
            }
        }
        register();
    }, []);

  return (
      <SafeAreaProvider>
          <FirebaseProvider>
              <AppNavigator/>
          </FirebaseProvider>
      </SafeAreaProvider>
  );
};

export default App;
