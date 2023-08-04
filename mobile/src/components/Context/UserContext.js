import React, {createContext, useEffect, useMemo, useReducer, useState} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {View} from 'react-native';


const initialState = {
    user: null
};

const initialContext = [{ ...initialState }, () => {}];

export const UserContext = createContext(initialContext);

export const FirebaseProvider = (props) => {

    const [firebaseUser, setFirebaseUser] = useState(null);
    const [user, setUser] = useState(null);
    const [isAuth, setIsAuth] = useState(null);

    const getUserData = async (userAuth) => {
        if(userAuth){
            await firestore().collection('users').doc(userAuth.uid).get().then((doc) => {
                setUser(doc);
            });
        }
    }

    useEffect(() => {
        auth().onAuthStateChanged(async (userAuth) => {
            if (userAuth) {
                setFirebaseUser(userAuth);
                await getUserData(userAuth);
                setIsAuth(true);
            }else{
                setIsAuth(false);
            }
        })
    }, []);

    const contextValue = {
        user: user,
        firebaseUser:firebaseUser,
        authenticated:isAuth,
        updateUser: setUser
    };
    if(isAuth === null){
        return(<View/>)
    }else{
        return (
            <UserContext.Provider value={contextValue}>
                {props.children}
            </UserContext.Provider>
        )
    }
}
