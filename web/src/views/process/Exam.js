import React, {useState} from "react";
import {
    Card,
    CardContent,
    CardHeader, Container,
    Grid,
    List, ListItem, ListItemText,
    Typography
} from "@material-ui/core";
import {useTranslation} from "react-i18next";
import Button from "@material-ui/core/Button";
import firebase from "firebase";

function Exam(props){
    const {t, i18n} = useTranslation('common');
    const [start, setStart] = useState(false);
    const [end, setEnd] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [score, setScore] = useState(0);
    const [index, setIndex] = useState(0);

    const startExam = async () => {
        await firebase.firestore().collection("exam")
            .limit(10)
            .get()
            .then((querySnapshot) => {
                let tmp = [];
                querySnapshot.forEach((doc) => {
                    tmp.push(doc.data());
                    console.log(doc.id, " => ", doc.data());
                });
                setQuestions(tmp);
        });

        setStart(true);
    }

    const isValidResponse = async (i) => {
        let tmpScore = score;
        if(i === questions[index].response[0]){
            /**
             * To DELETE
             */
            tmpScore+=10;
            setScore(tmpScore);
        }
        if(index === questions.length-1){
            if(tmpScore > 15){
                await firebase.firestore().collection("users").doc(props.user.uid).update({
                    "driver.status":"PENDING",
                    "driver.update_time": firebase.firestore.FieldValue.serverTimestamp()
            }).catch((er)=>{
                    console.log(er);
                })
            }
            setEnd(true);
        }else{
            setIndex(index+1);
        }
    }

    return (
        <Container>
            <div>
                <Grid container spacing={3} justify="center" alignItems="center" direction="column" style={{width:'100%', height:'100%'}}>
                    <Grid item style={{minWidth:'50%'}}>
                        <Card style={{padding:10}} elevation={0}>
                            <div>
                                <CardHeader title={t('driverProcess.process.step3.title')} subheader={t('driverProcess.process.step3.sub')}/>
                                {!end ? (
                                    <CardContent>
                                        { !start ? (
                                            <Grid container spacing={3} justify="center" alignItems="center" direction="column">
                                                <Grid item>
                                                    <Typography>{t('driverProcess.process.step3.examDesc')}</Typography>
                                                </Grid>
                                                <Grid item>
                                                    <Button onClick={startExam} variant="contained">{t('driverProcess.process.step3.start')}</Button>
                                                </Grid>
                                            </Grid>
                                        ):(
                                            <Grid container spacing={3} justify="center" alignItems="center" direction="column">
                                                <Grid item>
                                                    <div>
                                                        {i18n.language === "fr"
                                                            ?
                                                            <Typography>{questions[index].fr}</Typography>
                                                            :
                                                            <Typography>{questions[index].en}</Typography>
                                                        }
                                                        <List aria-label="main">
                                                            {questions[index].answerType === "number" &&
                                                                questions[index].answers.map((answer, i) => {
                                                                    return (
                                                                        <ListItem button divider key={i} onClick={() => isValidResponse(i)}>
                                                                            <ListItemText primary={answer} />
                                                                        </ListItem>
                                                                    )
                                                                })
                                                            }
                                                            {questions[index].answerType === "string" &&
                                                                questions[index].answers.map((answer, i) => {
                                                                    return (
                                                                        <ListItem button divider key={i} onClick={() => isValidResponse(i)}>
                                                                            <ListItemText primary={t(`general.${answer}`)} />
                                                                        </ListItem>
                                                                    )
                                                                })
                                                            }
                                                        </List>
                                                    </div>
                                                </Grid>
                                            </Grid>
                                        )}
                                    </CardContent>
                                ): (
                                    <CardContent>
                                        {score > 15 ? (
                                            <Grid container justify="center" alignItems="center" spacing={3} direction="column">
                                                <Grid item>
                                                    <Typography>{t('driverProcess.process.step3.success')}{score}/20</Typography>
                                                </Grid>
                                                <Grid item>
                                                    <Button variant="contained" onClick={props.goToNext}>
                                                        {t('general.next')}
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        ):(
                                            <Grid container justify="center" alignItems="center" spacing={3} direction="column">
                                                <Grid item>
                                                    <Typography>{t('driverProcess.process.step3.failed')}</Typography>
                                                </Grid>
                                                <Grid item>
                                                    <Button variant="contained" onClick={props.goToPrevious}>
                                                        {t('general.back')}
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        )}

                                    </CardContent>
                                )}

                            </div>
                        </Card>
                    </Grid>
                </Grid>
            </div>
        </Container>
    );
}

export default Exam;
