import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";
import Toolbar from "@material-ui/core/Toolbar";
import Grid from "@material-ui/core/Grid";
import Base from "./Base";
import { useParams } from 'react-router-dom';
import {
    Card,
    CardContent,
    CardHeader,
    Icon,
    ListItem,
    ListItemText, TextField,
    Typography
} from "@material-ui/core";
import firebase from "firebase";
import List from "@material-ui/core/List";
import Button from "@material-ui/core/Button";
import * as Routes from "../../navigation/Routes";

function Support(){
    const {t, i18n} = useTranslation('common');
    const history = useHistory();
    const [support, setSupport] =  useState(null);
    const [response, setResponse] = useState("");
    let { id } = useParams();

    useEffect( () => {
        async function getDriver(){
            await firebase.firestore().collection("support").doc(id).get().then((doc)=>{
                setSupport(doc);
                console.log(doc.data().drive);
            });
        }
        getDriver();
    }, [id] )


    const changeText = (e) =>{
        setResponse(e.target.value);
    }

    const sendResponse = async () =>{
        let arr = support.data().message;
        let time = firebase.firestore.Timestamp.fromDate(new Date());
        let newResponse = {
            sender:1,
            message:response,
            creation_time: time
        }
        arr.push(newResponse);
        await firebase.firestore().collection("support").doc(id).update({
            message:arr,
            "update_time": firebase.firestore.FieldValue.serverTimestamp()
        });
        history.push(Routes.ADMIN_SUPPORT_CENTER);
    }

    const closeTicket = async () => {
        await firebase.firestore().collection("support").doc(id).update({
            "status":"CLOSED",
            "update_time": firebase.firestore.FieldValue.serverTimestamp()
        });
        history.push(Routes.ADMIN_SUPPORT_CENTER);
    }

    return (
        <Base>
            <Toolbar />
            {support !== null ? (
                <Grid container justify="center" direction="column" spacing={3}>
                    <Grid item>
                        <Grid container justify="center" direction="row" spacing={5}>
                            <Grid item xs={12} md={12}>
                                <Card>
                                    <CardContent>
                                        <Grid container justify="flex-end" direction="row" spacing={5}>
                                            <Grid item>
                                                <Button onClick={() => closeTicket()} variant="contained" color="primary">{t('admin.supportCenter.closeTicket')}</Button>
                                            </Grid>
                                            <Grid item onClick={() => history.goBack()}>
                                                <Button variant="contained" color="secondary">{t('general.cancel')}</Button>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Card>
                                    <CardHeader title={id}/>
                                    <CardContent>
                                        <List>
                                            <ListItem alignItems="center" button onClick={() => history.push(Routes.ADMIN_USER_CENTER+'/'+support.data().customer.id)}>
                                                <ListItemText primaryTypographyProps={{align:'left'}} primary={t('admin.driverCenter.goToUserProfile')} />
                                            </ListItem>
                                            <ListItem alignItems="center" button>
                                                <ListItemText primaryTypographyProps={{align:'left'}} primary={t('admin.supportCenter.driveDetails')} />
                                            </ListItem>
                                        </List>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Card>
                                    <CardHeader title={t('admin.supportCenter.driveDetails')}/>
                                    <CardContent>
                                        {support.data().drive === null ? (
                                                <List>
                                                    <ListItem>
                                                        <ListItemText primaryTypographyProps={{align:'left'}} primary={t('admin.supportCenter.noDrive')} />
                                                    </ListItem>
                                                </List>
                                            ) : (
                                            <List>
                                                <ListItem>
                                                    <ListItemText primaryTypographyProps={{align:'left'}} primary={t('admin.supportCenter.duration')} />
                                                    <ListItemText primaryTypographyProps={{align:'right'}} primary={"0#TODO"} />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemText primaryTypographyProps={{align:'left'}} primary={t('admin.supportCenter.expectedDuration')} />
                                                    <ListItemText primaryTypographyProps={{align:'right'}} primary={"0#TODO"} />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemText primaryTypographyProps={{align:'left'}} primary={t('admin.supportCenter.distance')} />
                                                    <ListItemText primaryTypographyProps={{align:'right'}} primary={"0#TODO"} />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemText primaryTypographyProps={{align:'left'}} primary={t('admin.supportCenter.initialPrice')} />
                                                    <ListItemText primaryTypographyProps={{align:'right'}} primary={"0#TODO"} />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemText primaryTypographyProps={{align:'left'}} primary={t('admin.supportCenter.totalPaid')} />
                                                    <ListItemText primaryTypographyProps={{align:'right'}} primary={"0#TODO"} />
                                                </ListItem>
                                                <ListItem button>
                                                    <ListItemText primaryTypographyProps={{align:'left'}} primary={t('admin.supportCenter.driverProfile')} />
                                                </ListItem>
                                            </List>
                                            )}
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Card>
                            <CardHeader title={t('admin.supportCenter.messages')}/>
                            <CardContent>
                                <List>
                                    {support.data().message.map((m, i) => {
                                        return(
                                            <ListItem key={i}>
                                                <ListItemText style={m.sender === 0 ?{backgroundColor:'#33bfff', padding:5} : {backgroundColor:'#EBECF0', padding:5}} primaryTypographyProps={{align: m.sender === 0 ? 'left' : 'right'}} secondaryTypographyProps={{align: m.sender === 0 ? 'left' : 'right'}} primary={m.message} secondary={m.creation_time.toDate().toLocaleString(i18n.language)}/>
                                            </ListItem>
                                        )
                                    })}
                                    <ListItem>
                                        <ListItemText primaryTypographyProps={{align: 'left'}} primary={<TextField style={{width:'100%'}} id="standard-basic" name="response" placeholder={t('admin.supportCenter.response')} value={response} onChange={changeText} />}/>
                                    </ListItem>
                                    <ListItem button onClick={() => sendResponse()}>
                                        <ListItemText primaryTypographyProps={{align:'center'}} primary={<Icon className="fas fa-paper-plane" />} />
                                    </ListItem>
                                </List>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            ) : (
                <Typography></Typography>
            )}
        </Base>
    )
}

export default Support;
