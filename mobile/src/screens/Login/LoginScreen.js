import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text, Button} from 'react-native-elements';
import SignInWithGoogle from '../../components/Login/SignInWithGoogle';
import SignInWithFacebook from '../../components/Login/SignInWithFacebook';
import Background from '../../components/theme/Background';


function LoginScreen({navigation}){
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
                <SignInWithGoogle navigation={navigation}/>
                <SignInWithFacebook navigation={navigation}/>
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

export default LoginScreen;
