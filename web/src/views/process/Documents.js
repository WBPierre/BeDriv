import React, {useState} from "react";
import {
    Card,
    CardHeader, Container,
    Divider,
    Grid,
    Icon,
    Typography
} from "@material-ui/core";
import {useTranslation} from "react-i18next";
import Button from "@material-ui/core/Button";
import firebase from "firebase";

function Documents(props){
    const {t} = useTranslation('common');
    const [files, setFiles] = useState({
        "id": null,
        "record":null,
        "car":null
    });
    const [size, setSize] = useState(0);
    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        console.log(props.user.uid);
        let uploadFiles = files;
        uploadFiles[e.target.name] = e.target.files[0];
        setFiles(uploadFiles);
        let count = 0;
        for(let i = 0; i < Object.keys(uploadFiles).length; i++){
            if(uploadFiles[Object.keys(uploadFiles)[i]] !== null) count++;
        }
        setSize(count);
    }

    async function handleUpload() {
        if(!loading){
            setLoading(true);
            await firebase.storage().ref(`/${props.user.uid}/id`).put(files.id).then(async () => {
                await firebase.storage().ref(`/${props.user.uid}/record`).put(files.record).then(async ()=> {
                    await firebase.storage().ref(`/${props.user.uid}/car`).put(files.car).then(async () => {
                        await updateFirestoreUser();
                        props.goToNext();
                    });
                });
            });
        }
    }

    async function updateFirestoreUser(){
        await firebase.firestore().collection("users").doc(props.user.uid).update({
            driver:{
                status:"SUBMITED",
                active:false,
                creation_time: firebase.firestore.FieldValue.serverTimestamp(),
                update_time: firebase.firestore.FieldValue.serverTimestamp()
            }
        }).then(()=>{
            console.log('OK');
        }).catch((er)=>{
            console.log(er);
        })
    }



    return (
        <Container>
            <div>
                <Grid container spacing={3} justify="center" alignItems="center" direction="column" style={{width:'100%', height:'100%'}}>
                    <Grid item style={{minWidth:'50%'}}>
                        <Card style={{padding:10}} elevation={0}>
                            <div>
                                <CardHeader title={t('driverProcess.process.step1.titleText')}/>
                                <Grid container spacing={4} justify="center" alignItems="center" direction="column">
                                    <Grid item style={{width:'100%'}}>
                                        <Grid container direction="row">
                                            <Grid item xs={6}>
                                                <Typography>{t('driverProcess.process.step1.id')}</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <input type="file" name="id" onChange={handleChange}/>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Divider style={{width:'100%'}}/>
                                    <Grid item style={{width:'100%'}}>
                                        <Grid container direction="row">
                                            <Grid item xs={6}>
                                                <Typography>{t('driverProcess.process.step1.criminalRecord')}</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <input type="file" name="record" onChange={handleChange}/>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Divider style={{width:'100%'}}/>
                                    <Grid item style={{width:'100%'}}>
                                        <Grid container direction="row">
                                            <Grid item xs={6}>
                                                <Typography>{t('driverProcess.process.step1.carRegistration')}</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <input type="file" name="car" onChange={handleChange}/>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item>
                                        <Button variant="contained" disabled={size !== 3} onClick={handleUpload}>
                                            {!loading ? (
                                                t('general.next')
                                            ):(
                                                <Icon className="fas fa-spinner fa-spin"/>
                                            )}

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

export default Documents;
