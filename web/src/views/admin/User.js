import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";
import Toolbar from "@material-ui/core/Toolbar";
import Grid from "@material-ui/core/Grid";
import Base from "./Base";
import { useParams } from 'react-router-dom';
import {
    Avatar,
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

function User(){
    const {t, i18n} = useTranslation('common');
    const history = useHistory();
    const [user, setUser] =  useState(null);
    const [givenName, setGivenName] = useState("");
    const [familyName, setFamilyName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [notes, setNotes] = useState("");
    const [picture, setPicture] = useState("");
    let { id } = useParams();

    useEffect( () => {
        async function getUser(){
            await firebase.firestore().collection("users").doc(id).get().then((doc)=>{
                setUser(doc);
                setGivenName(doc.data().given_name);
                setFamilyName(doc.data().family_name);
                setPicture(doc.data().picture);
                setEmail(doc.data().email);
                setPhone(doc.data().phone_number);
                if(doc.data().notes) setNotes(doc.data().notes);
            });
        }
        getUser();
    }, [id] )


    const changeText = (e) =>{
        switch(e.target.name){
            case "givenName":
                setGivenName(e.target.value);
                break;
            case "familyName":
                setFamilyName(e.target.value);
                break;
            case "picture":
                setPicture(e.target.value);
                break;
            case "email":
                setEmail(e.target.value);
                break;
            case "phone":
                setPhone(e.target.value);
                break;
            case "notes":
                setNotes(e.target.value);
                break;
            default:
                break;
        }
    }

    const onSave = async () =>{
        await firebase.firestore().collection("users").doc(user.id).update({
            "family_name":familyName,
            "given_name":givenName,
            "picture":picture,
            "email":email,
            "phone":phone,
            "notes":notes,
            "update_time": firebase.firestore.FieldValue.serverTimestamp()
        });
        history.push(Routes.ADMIN_USER_CENTER);
    }

    const deleteAccount = async () => {
        await firebase.firestore().collection("users").doc(user.id).delete().then(() => {
            history.push(Routes.ADMIN_USER_CENTER);
        })
    }
    return (
        <Base>
            <Toolbar />
            {user !== null ? (
                <Grid container justify="center" direction="column" spacing={3}>
                    <Grid item>
                        <Grid container justify="center" direction="row" spacing={5}>
                            <Grid item xs={12} md={12}>
                                <Card>
                                    <CardContent>
                                        <Grid container justify="flex-end" direction="row" spacing={5}>
                                            <Grid item>
                                                <Button onClick={() => deleteAccount()} variant="contained" style={{backgroundColor:'red', color:'white'}}>{t('admin.general.delete')}</Button>
                                            </Grid>
                                            <Grid item>
                                                <Button onClick={() => onSave()} variant="contained" color="primary">{t('general.save')}</Button>
                                            </Grid>
                                            <Grid item onClick={() => history.push(Routes.ADMIN_USER_CENTER)}>
                                                <Button variant="contained" color="secondary">{t('general.cancel')}</Button>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Card>
                                    <CardHeader title={user.id}/>
                                    <CardContent>
                                        <List>
                                            <ListItem>
                                                <ListItemText primaryTypographyProps={{align:'left'}} primary={<Avatar variant="square" alt={user.data().given_name} src={user.data().picture} />}/>
                                                <ListItemText primaryTypographyProps={{align:'right'}} primary={<TextField id="standard-basic" onChange={changeText} name="picture" value={picture}/>} />
                                            </ListItem>
                                            <ListItem>
                                                <ListItemText primaryTypographyProps={{align:'left'}} primary={t('admin.general.given_name')}/>
                                                <ListItemText primaryTypographyProps={{align:'right'}} primary={<TextField id="standard-basic" onChange={changeText} name="givenName" value={givenName}/>} />

                                            </ListItem>
                                            <ListItem>
                                                <ListItemText primaryTypographyProps={{align:'left'}} primary={t('admin.general.family_name')} />
                                                <ListItemText primaryTypographyProps={{align:'right'}} primary={<TextField id="standard-basic" onChange={changeText} name="familyName" value={familyName}/>} />
                                            </ListItem>
                                            <ListItem alignItems="center">
                                                <ListItemText primaryTypographyProps={{align:'left'}} primary={t('admin.general.email')} />
                                                <ListItemText primaryTypographyProps={{align:'right'}} primary={<TextField id="standard-basic" onChange={changeText} name="email" value={email}/>} />
                                            </ListItem>
                                            <ListItem alignItems="center">
                                                <ListItemText primaryTypographyProps={{align:'left'}} primary={t('admin.general.phone')} />
                                                <ListItemText primaryTypographyProps={{align:'right'}} primary={<TextField id="standard-basic" onChange={changeText} name="phone" value={phone}/>} />
                                            </ListItem>
                                        </List>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Card>
                                    <CardHeader title={t('admin.general.information')}/>
                                    <CardContent>
                                        <List>
                                            <ListItem>
                                                <ListItemText primaryTypographyProps={{align:'left'}} primary={t('admin.general.inDrive')} />
                                                <ListItemText primaryTypographyProps={{align:'right'}} primary={user.data().drive_status === false ?
                                                    <Icon className="fas fa-times-circle" style={{color:'red'}} /> :
                                                    <Icon className="fas fa-check-square" style={{color:'green'}} />
                                                } />
                                            </ListItem>
                                            <ListItem>
                                                <ListItemText primaryTypographyProps={{align:'left'}} primary={t('admin.general.numberOfDrives')} />
                                                <ListItemText primaryTypographyProps={{align:'right'}} primary="0#TODO" />
                                            </ListItem>
                                            <ListItem>
                                                <ListItemText primaryTypographyProps={{align:'left'}} primary={t('admin.general.accountCreationDate')} />
                                                <ListItemText primaryTypographyProps={{align:'right'}} primary={user.data().creation_time.toDate().toLocaleString(i18n.language)} />
                                            </ListItem>
                                            <ListItem>
                                                <ListItemText primaryTypographyProps={{align:'left'}} primary={t('admin.general.lastUpdate')} />
                                                <ListItemText primaryTypographyProps={{align:'right'}} primary={user.data().update_time.toDate().toLocaleString(i18n.language)} />
                                            </ListItem>
                                        </List>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Card>
                            <CardHeader title={t('admin.general.information')}/>
                            <CardContent>
                                <List>
                                    <ListItem>
                                        <ListItemText primary={<TextField style={{width:'100%'}} aria-label="minimum height" name="notes" value={notes} rowsMin={5} multiline placeholder="Admin notes" onChange={changeText} />}/>
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

export default User;
