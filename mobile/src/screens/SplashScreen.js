import React, {useContext, useEffect} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-elements';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import * as KEYS from '../utils/GoogleParameters';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {UserContext} from '../components/Context/UserContext';
import Background from '../components/theme/Background';
import messaging from '@react-native-firebase/messaging';



function SplashScreen({navigation}){
    const context = useContext(UserContext);

    function configureGoogleSign() {
        GoogleSignin.configure({
            webClientId: KEYS.WEB_CLIENT_ID,
            offlineAccess: true
        });
    }

    useEffect(async () => {
        configureGoogleSign();
        async function tryGoogleLogin() {
            try {
                const {idToken} = await GoogleSignin.signInSilently();
                const googleCredential = await auth.GoogleAuthProvider.credential(idToken);
                const userCredential = await auth().signInWithCredential(googleCredential);
                const device_token = await messaging().getToken();
                await firestore()
                    .collection('users')
                    .doc(userCredential.user.uid)
                    .get()
                    .then(async (doc) => {
                        if(doc.exists){
                            if(device_token !== doc.data().device_token){
                                await firestore()
                                    .collection('users')
                                    .doc(userCredential.user.uid)
                                    .update({
                                        "device_token":device_token
                                    })
                            }
                            context.user = doc;
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Home' }]
                            })
                        }else{
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Login' }]
                            })
                        }
                    }).catch((err)=>
                    console.log("HERE", err));
            } catch (error) {
                console.log('Something else went wrong... ', error.toString());
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }]
                })
            }
        }
        if(context.authenticated !== true && context.user !== null){
            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }]
            })
        }else{
            await tryGoogleLogin();
        }
    }, []);

    return(
        <View style={styles.container}>
            <Background/>
            <View style={{flex:2}}>
                <View style={styles.title}>
                    <Text h2 style={styles.firstPartLogo}>Be</Text>
                    <Text h2 style={styles.secondPartLogo}>Driv</Text>
                </View>
            </View>
            <View style={styles.container}>
                <ActivityIndicator/>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title:{
        flex:1,
        justifyContent: 'center',
        alignItems:'center',
        flexDirection:'row'
    },
    firstPartLogo:{
        fontFamily: 'Nunito-Regular',
        backgroundColor:'white',
        padding:5,
        fontWeight:'800'
    },
    secondPartLogo:{
        fontFamily: 'Nunito-Regular',
        color:'white'
    }
});


export default SplashScreen;
