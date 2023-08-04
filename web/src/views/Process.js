import React from "react";
import Base from "./Base";
import {Card, CardHeader, Grid, Typography} from "@material-ui/core";
import {useTranslation} from "react-i18next";
import Button from "@material-ui/core/Button";
import IntroBackground from "../components/Background/IntroBackground";
import {useHistory} from "react-router-dom";
import * as Routes from "../navigation/Routes";

function Process(){
    const {t} = useTranslation('common');
    const history = useHistory();


    function goToDocuments(){
        history.push(Routes.PROCESS_DOC);
    }

    return (
        <Base>
            <div style={{width: '100%', height:'100vh'}}>
                <IntroBackground/>
                <Grid container spacing={3} justify="center" alignItems="center" direction="column" style={{width:'100%', height:'100%'}}>
                    <Grid item style={{minWidth:'40%'}}>
                        <Card style={{padding:10}}>
                                <div>
                                    <CardHeader title={t('driverProcess.welcomeToBeDriv')} subheader={t('driverProcess.toStartup')}/>
                                    <Grid container spacing={2} justify="center" alignItems="center" direction="column">
                                        <Grid item>
                                            <Typography>{t('driverProcess.processDesc')}</Typography>
                                        </Grid>
                                        <Grid item>
                                            <Button variant="contained" onClick={goToDocuments}>
                                                {t('driverProcess.start')}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </div>
                        </Card>
                    </Grid>
                </Grid>
            </div>
        </Base>
    );
}

export default Process;
