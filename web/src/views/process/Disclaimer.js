import React from "react";
import {
    Card,
    CardHeader, Container,
    Divider,
    Grid,
    Typography
} from "@material-ui/core";
import {useTranslation} from "react-i18next";
import Button from "@material-ui/core/Button";

function Disclaimer(props){
    const {t} = useTranslation('common');

    return (
        <Container>
            <div>
                <Grid container spacing={3} justify="center" alignItems="center" direction="column" style={{width:'100%', height:'100%'}}>
                    <Grid item>
                        <Card style={{padding:10}} elevation={0}>
                            <div>
                                <CardHeader title={t('driverProcess.process.step2.titleText')}/>
                                <Grid container spacing={4} justify="center" alignItems="center" direction="column">
                                    <Grid item>
                                        <Typography>{t('driverProcess.process.step2.desc')}</Typography>
                                    </Grid>
                                    <Divider style={{width:'100%'}}/>
                                    <Grid item>
                                        <Typography>{t('driverProcess.process.step2.chargeDesc')}</Typography>
                                        <Typography>{t('driverProcess.process.step2.currentFees')} <span style={{fontWeight:800}}>3.16%</span></Typography>
                                    </Grid>
                                    <Divider style={{width:'100%'}}/>
                                    <Grid item>
                                        <Button variant="contained" onClick={props.goToNext}>
                                            Next
                                        </Button>
                                    </Grid>
                                </Grid>
                            </div>
                        </Card>
                    </Grid>
                </Grid>
            </div>
        </Container>
    );
}

export default Disclaimer;
