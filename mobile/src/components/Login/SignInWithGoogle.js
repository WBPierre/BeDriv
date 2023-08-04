import React, {useContext, useEffect} from 'react';
import {View, StyleSheet, Image, TouchableOpacity, Text} from 'react-native';
import {
    GoogleSignin,
    statusCodes
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {UserContext} from '../Context/UserContext';
import I18n from "../../utils/i18n";
import messaging from '@react-native-firebase/messaging';


function SignInWithGoogle(props){
    const context = useContext(UserContext);

    async function signIn(){
        try {
            const {accessToken, idToken} = await GoogleSignin.signIn();
            const credential = auth.GoogleAuthProvider.credential(
                idToken,
                accessToken,
            );
            const userCredential = await auth().signInWithCredential(credential);
            const device_token = await messaging().getToken();
            context.firebaseUser = userCredential.user;
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
                        props.navigation.reset({
                            index: 0,
                            routes: [{ name: 'Home' }]
                        })
                    }else{
                        const user = {
                            uid: userCredential.user.uid,
                            given_name : userCredential.additionalUserInfo.profile.given_name,
                            family_name : userCredential.additionalUserInfo.profile.family_name,
                            email: userCredential.additionalUserInfo.profile.email,
                            emailVerified: userCredential.additionalUserInfo.profile.email_verified,
                            picture: userCredential.additionalUserInfo.profile.picture,
                            locale: userCredential.additionalUserInfo.profile.locale,
                        }
                        props.navigation.navigate('AccountCreation', {user: user});
                    }
                })
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                console.log('user cancelled the login flow');
            } else if (error.code === statusCodes.IN_PROGRESS) {
                console.log('operation (e.g. sign in) is in progress already');
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                console.log('play services not available or outdated');
            } else {
                console.log('some other error happened');
            }
        }
    }

    return(
        <TouchableOpacity style={styles.container} onPress={signIn} >
            <View style={styles.googleLoginView}>
                <View style={styles.googleLoginIconView}>
                    <Image resizeMode="contain" style={{ height: 26, width: 26 }} source={require('../../assets/image/customIcons/google.png')} />
                </View>
                <View style={styles.googleLoginTextView}>
                    <Text style={styles.googleLoginTextStyle}>{I18n.t('login.loginWithGoogle')}</Text>
                </View>
            </View>

        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container:{
        margin:20
    },
    googleLoginView:{
        backgroundColor: '#fff',
        flexDirection: 'row',
        padding:10,
        borderRadius:10
    },
    googleLoginIconView:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    googleLoginTextView:{
        flex:3,
        justifyContent: 'center',
        alignItems: 'center'
    },
    googleLoginTextStyle:{
        fontFamily: 'Nunito-Regular',
        color: '#3A476A',
        fontWeight:'500',
        fontSize: 18
    }
})

export default SignInWithGoogle;
