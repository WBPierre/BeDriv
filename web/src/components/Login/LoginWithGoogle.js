import React from "react";
import {Avatar, Button, Grid, Typography} from "@material-ui/core";
import google from "../../assets/img/customIcons/google.png";
import {useTranslation} from "react-i18next";
import "./LoginButton.css";
import firebase from "firebase";

function LoginWithGoogle(){
    const {t} = useTranslation('common');

    const loginAsync = async () =>{
        const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
        await firebase.auth().signInWithPopup(googleAuthProvider);
    }

    return (
        <div>
            <Button onClick={() => loginAsync()}>
                <Grid container direction="row" className="googleLoginView">
                    <Grid item xs={6} className="googleLoginIconView">
                        <Avatar alt="Google logo" src={google} />
                    </Grid>
                    <Grid item xs={6} className="googleLoginTextView">
                        <Typography className="loginTextStyle">{t('login.google')}</Typography>
                    </Grid>
                </Grid>
            </Button>
        </div>
    )
}
export default LoginWithGoogle;
