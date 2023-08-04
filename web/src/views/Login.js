import React, {useEffect, useState} from "react";
import Base from "./Base";
import {Card, CardContent, CardHeader, Divider, Grid, Typography} from "@material-ui/core";
import {useTranslation} from "react-i18next";
import LoginWithGoogle from "../components/Login/LoginWithGoogle";
import LoginWithFacebook from "../components/Login/LoginWithFacebook";
import GoogleBadge from "../assets/img/badges/google-play-badge.png";
import AppleBadge from "../assets/img/badges/app-store-badge.png";
import Button from "@material-ui/core/Button";
import IntroBackground from "../components/Background/IntroBackground";
import firebase from "firebase";
import {useHistory} from "react-router-dom";
import * as Routes from "../navigation/Routes";

function Login(){
    const {t} = useTranslation('common');
    const history = useHistory();
    const [hasAccount, setHasAccount] = useState(false);
    const [canBeDriver, setCanBeDriver] = useState(true);
    const [isLogin, setIsLogin] = useState(false);

    function goToProcess() {
        history.push(Routes.PROCESS);
    }

    useEffect( () => {
        async function getUser(){
            await firebase.auth().onAuthStateChanged(async function(user) {
                if (user) {
                    setIsLogin(true);
                    await firebase.firestore().collection('users').doc(user.uid).get().then((doc) => {
                        if(doc.exists){
                            setHasAccount(true);
                            if(doc.data().admin){
                                history.push(Routes.ADMIN);
                            }
                            if(doc.data().driver !== null && (doc.data().driver.status === "BANNED" || doc.data().driver.status === "ACCEPTED")){
                                setCanBeDriver(false);
                            }
                        }
                    })
                }
            });
        }
        getUser();
    }, [history]);

    const logOff = async () => {
        firebase.auth().signOut().then(function() {
            history.push(Routes.HOME);
        }, function(error) {
            console.log("Error", error);
        });
    }

    return (
        <Base>
            <div style={{width: '100%', height:'100vh'}}>
                <IntroBackground/>
                <Grid container spacing={3} justify="center" alignItems="center" direction="column" style={{width:'100%', height:'100%'}}>
                    <Grid item style={{minWidth:'40%'}}>
                        <Card style={{padding:10}}>
                            {isLogin === false ? (
                                <div>
                                    <CardHeader title={t('login.cardHeader')}/>
                                    <CardContent>
                                        <Grid container spacing={5} justify="center" alignItems="center" direction="column">
                                            <Grid item>
                                                <LoginWithGoogle/>
                                            </Grid>
                                            <Grid item>
                                                <LoginWithFacebook/>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </div>
                            ) : (
                                <div>
                                    <CardHeader title="BeDriv"/>
                                    <Grid container spacing={2} justify="center" alignItems="center" direction="column">
                                        <Grid item>
                                            <Typography>{t('login.download')}</Typography>
                                        </Grid>
                                        <Grid item>
                                            <Grid container direction="row" spacing={1}>
                                                <Grid item >
                                                    <img src={GoogleBadge} alt="Google-Badge" style={{height:100}}/>
                                                </Grid>
                                                <Grid item>
                                                    <img src={AppleBadge} alt="Apple-Badge" style={{height:100}}/>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <div hidden={!canBeDriver}>
                                            <Divider style={{width:'100%'}}/>
                                            { hasAccount !== false ? (
                                                <Grid item>
                                                    <Button onClick={goToProcess}>
                                                        {t('login.becomeADriver')}
                                                    </Button>
                                                </Grid>
                                            ) : (
                                                <Grid item>
                                                    <Button>
                                                        {t('login.downloadTheApp')}
                                                    </Button>
                                                </Grid>
                                            )}
                                        </div>
                                        <Grid item>
                                            <Divider style={{width:'100%'}}/>
                                            <Button onClick={logOff}>
                                                {t('login.logOff')}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </div>
                                )}
                        </Card>
                    </Grid>
                </Grid>
            </div>
        </Base>
    );
}

export default Login;
