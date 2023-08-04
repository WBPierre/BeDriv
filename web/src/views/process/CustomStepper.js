import React, {useEffect, useState} from "react";
import Base from "../Base";
import {
    Card,
    CardContent,
    CardHeader,
    Grid,
    Step, StepLabel,
    Stepper,
    Typography
} from "@material-ui/core";
import {useTranslation} from "react-i18next";
import IntroBackground from "../../components/Background/IntroBackground";
import firebase from "firebase";
import Documents from "./Documents";
import Disclaimer from "./Disclaimer";
import Exam from "./Exam";

function CustomStepper(){
    const {t} = useTranslation('common');
    const [user, setUser] = useState(null);
    const [activeStep, setActiveStep] = React.useState(0);

    useEffect(() => {
        async function getUser(){
            await firebase.auth().onAuthStateChanged( async function(user) {
                if (user) {
                    setUser(user);
                    const res = await firebase.firestore().collection("users").doc(user.uid).get();
                    const data = res.data();
                    if(data.driver !== null) {
                        if(data.driver.status === "SUBMITED"){
                            setActiveStep(1);
                        }
                        if(data.driver.status === "PENDING"){
                            setActiveStep(3);
                        }
                    }
                } else {
                    console.log('Shouldnt be here');
                }
            });
        }
        getUser();
    }, []);

    function getSteps() {
        return [t('driverProcess.process.step1.title'), t('driverProcess.process.step2.title'), t('driverProcess.process.step3.title')];
    }
    function getStepContent(stepIndex) {
        switch (stepIndex) {
            case 0:
                return <Documents goToNext={handleNext} user={user}/>;
            case 1:
                return <Disclaimer goToNext={handleNext}/>;
            case 2:
                return <Exam goToNext={handleNext} goToPrevious={handleBack} user={user}/>;
            default:
                return 'Unknown stepIndex';
        }
    }
    const steps = getSteps();

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    return (
        <Base>
            <div style={{width: '100%', height:'100vh'}}>
                <IntroBackground/>
                {user && (
                    <Grid container spacing={3} justify="center" alignItems="center" direction="column" style={{width:'100%', height:'100%'}}>
                        <Grid item style={{width:'60%'}}>
                            <Card style={{padding:10}}>
                                <div>
                                    <Stepper activeStep={activeStep} alternativeLabel>
                                        {steps.map((label) => (
                                            <Step key={label}>
                                                <StepLabel>{label}</StepLabel>
                                            </Step>
                                        ))}
                                    </Stepper>
                                    <div>
                                        {activeStep === steps.length ? (
                                            <div>
                                                <Card style={{padding:10}} elevation={0}>
                                                    <div>
                                                        <CardHeader title={t('driverProcess.process.step4.title')}/>
                                                        <CardContent>
                                                            <Grid container spacing={3} justify="center" alignItems="center" direction="column">
                                                                <Grid item>
                                                                    <Typography>{t('driverProcess.process.step4.descPending')}</Typography>
                                                                </Grid>
                                                            </Grid>
                                                        </CardContent>
                                                    </div>
                                                </Card>
                                            </div>
                                        ) : (
                                            <div>
                                                <Typography>{getStepContent(activeStep)}</Typography>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        </Grid>
                    </Grid>
                )}
            </div>
        </Base>
    );
}

export default CustomStepper;
