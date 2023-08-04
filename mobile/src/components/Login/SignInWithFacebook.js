import React, {useContext} from 'react';
import {Button, Icon} from 'react-native-elements';
import {View, StyleSheet, Image, Text, TouchableOpacity} from 'react-native';
import I18n from "../../utils/i18n";
import {UserContext} from '../Context/UserContext';
import auth from '@react-native-firebase/auth';
import { LoginManager, AccessToken, Profile } from 'react-native-fbsdk-next';
import firestore from '@react-native-firebase/firestore';

function SignInWithFacebook(props){
    const context = useContext(UserContext);

    async function signIn() {

        // Attempt login with permissions
        const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

        if (result.isCancelled) {
            throw 'User cancelled the login process';
        }

        // Once signed in, get the users AccesToken
        const data = await AccessToken.getCurrentAccessToken();

        if (!data) {
            throw 'Something went wrong obtaining access token';
        }

        // Create a Firebase credential with the AccessToken
        const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);

        // Sign-in the user with the credential
        const userCredential = await auth().signInWithCredential(facebookCredential);
        context.firebaseUser = userCredential.user;

        await firestore()
            .collection('users')
            .doc(userCredential.user.uid)
            .get()
            .then(doc => {
                if(doc.exists){
                    props.navigation.reset({
                        index: 0,
                        routes: [{ name: 'Home' }]
                    })
                }else{
                    const user = {
                        uid: userCredential.user.uid,
                        given_name : userCredential.user.displayName.split(" ")[0],
                        family_name : userCredential.user.displayName.split(" ")[1],
                        email: userCredential.user.email,
                        emailVerified: userCredential.user.emailVerified,
                        picture: userCredential.user.photoURL,
                        locale: "fr",
                    }
                    props.navigation.navigate('AccountCreation', {user: user});
                }
            })
    }
    return(
        <TouchableOpacity style={styles.container} onPress={signIn}>
            <View style={styles.googleLoginView}>
                <View style={styles.googleLoginIconView}>
                    <Icon style={{ height: 26, width: 26 }} color="white" type="font-awesome" name="facebook-square" />
                </View>
                <View style={styles.googleLoginTextView}>
                    <Text style={styles.googleLoginTextStyle}>{I18n.t('login.loginWithFacebook')}</Text>
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
        backgroundColor: '#3b5998',
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
        color: '#FFF',
        fontWeight:'500',
        fontSize: 18
    }
})

export default SignInWithFacebook;
