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

function Driver(){
    const {t} = useTranslation('common');
    const history = useHistory();
    const [user, setUser] =  useState(null);
    const [documents, setDocuments] = useState(null);
    const [carModel, setCarModel] = useState("");
    const [carBrand, setCarBrand] = useState("");
    const [active, setActive] = useState(null);
    const [carRegistration, setCarRegistration] = useState("");
    let { id } = useParams();

    useEffect( () => {
        async function getDriver(){
            await firebase.firestore().collection("users").doc(id).get().then((doc)=>{
                setUser(doc);
                setActive(doc.data().driver.active);
                if(doc.data().driver.car){
                    setCarModel(doc.data().driver.car.model);
                    setCarBrand(doc.data().driver.car.brand);
                    setCarRegistration(doc.data().driver.car.registration);
                }
            });
        }
        async function getDocuments(){
            await firebase.storage().ref().child(id).listAll().then(async (res)=>{
                let obj = {};
                for (const itemRef of res.items) {
                    obj[itemRef.name] = await itemRef.getDownloadURL();
                }
                setDocuments(obj);
            });
        }
        getDriver();
        getDocuments();
    }, [id] )


    const changeText = (e) =>{
        switch(e.target.name){
            case "brand":
                setCarBrand(e.target.value);
                break;
            case "model":
                setCarModel(e.target.value);
                break;
            case "registration":
                setCarRegistration(e.target.value);
                break;
            default:
                break;
        }
    }

    const changeActive = () => {
        setActive(!active);
    }

    const onSave = async () =>{
        if(carModel.length !== 0 && carBrand.length !== 0 && carRegistration !== 0){
            await firebase.firestore().collection("users").doc(user.id).update({
                "driver.car":{
                    brand:carBrand,
                    model:carModel,
                    registration:carRegistration
                },
                "driver.available": true,
                "driver.online":false,
                "driver.active":active,
                "driver.status": active ? "ACCEPTED" : "SUBMITED",
                "driver.update_time": firebase.firestore.FieldValue.serverTimestamp()
            });
            history.push(Routes.ADMIN_DRIVER_CENTER);
        }
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
                                                {active ? (
                                                    <Grid item>
                                                        <Button onClick={() => changeActive()} variant="contained" style={{backgroundColor:'red', color:'white'}}>{t('admin.driverCenter.block')}</Button>
                                                    </Grid>
                                                ):(
                                                    <Grid item>
                                                        <Button onClick={() => changeActive()} variant="contained" style={{backgroundColor:'green', color:'white'}}>{t('admin.driverCenter.activate')}</Button>
                                                    </Grid>
                                                )}

                                                <Grid item>
                                                    <Button onClick={() => onSave()} variant="contained" color="primary">{t('general.save')}</Button>
                                                </Grid>
                                                <Grid item onClick={() => history.push(Routes.ADMIN_DRIVER_CENTER)}>
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
                                                    <Avatar variant="square" alt={user.data().given_name} src={user.data().picture} />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemText primaryTypographyProps={{align:'left'}} primary={t('admin.general.given_name')}/>
                                                    <ListItemText primaryTypographyProps={{align:'right'}} primary={user.data().given_name} />

                                                </ListItem>
                                                <ListItem>
                                                    <ListItemText primaryTypographyProps={{align:'left'}} primary={t('admin.general.family_name')} />
                                                    <ListItemText primaryTypographyProps={{align:'right'}} primary={user.data().family_name} />
                                                </ListItem>
                                                <ListItem alignItems="center">
                                                    <ListItemText primaryTypographyProps={{align:'left'}} primary={t('admin.general.email')} />
                                                    <ListItemText primaryTypographyProps={{align:'right'}} primary={user.data().email} />
                                                </ListItem>
                                                <ListItem alignItems="center">
                                                    <ListItemText primaryTypographyProps={{align:'left'}} primary={t('admin.general.phone')} />
                                                    <ListItemText primaryTypographyProps={{align:'right'}} primary={user.data().phone_number} />
                                                </ListItem>
                                                <ListItem alignItems="center" button onClick={() => history.push(Routes.ADMIN_USER_CENTER+'/'+user.id)}>
                                                    <ListItemText primaryTypographyProps={{align:'left'}} primary={t('admin.driverCenter.goToUserProfile')} />
                                                </ListItem>
                                            </List>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Card>
                                        <CardHeader title={t('admin.general.driver')}/>
                                        <CardContent>
                                            <List>
                                                {documents !== null ? (
                                                    <div>
                                                        <ListItem button onClick={() => window.open(documents.id, "_blank")}>
                                                            <ListItemText primaryTypographyProps={{align:'left'}} primary={t('admin.driverCenter.id')} />
                                                            <ListItemText primaryTypographyProps={{align:'right'}} primary={t('general.see')} />
                                                        </ListItem>
                                                        <ListItem button onClick={() => window.open(documents.record, "_blank")}>
                                                            <ListItemText primaryTypographyProps={{align:'left'}} primary={t('admin.driverCenter.record')} />
                                                            <ListItemText primaryTypographyProps={{align:'right'}} primary={t('general.see')} />
                                                        </ListItem>
                                                        <ListItem button onClick={() => window.open(documents.car, "_blank")}>
                                                            <ListItemText primaryTypographyProps={{align:'left'}} primary={t('admin.driverCenter.car')} />
                                                            <ListItemText primaryTypographyProps={{align:'right'}} primary={t('general.see')} />
                                                        </ListItem>
                                                    </div>
                                                ):(
                                                    <div>
                                                        <ListItem>
                                                            <ListItemText primaryTypographyProps={{align:'left'}} primary={t('admin.driverCenter.id')} />
                                                            <ListItemText primaryTypographyProps={{align:'right'}} primary={t('general.empty')} />
                                                        </ListItem>
                                                        <ListItem>
                                                            <ListItemText primaryTypographyProps={{align:'left'}} primary={t('admin.driverCenter.record')} />
                                                            <ListItemText primaryTypographyProps={{align:'right'}} primary={t('general.empty')} />
                                                        </ListItem>
                                                        <ListItem>
                                                            <ListItemText primaryTypographyProps={{align:'left'}} primary={t('admin.driverCenter.car')} />
                                                            <ListItemText primaryTypographyProps={{align:'right'}} primary={t('general.empty')} />
                                                        </ListItem>
                                                    </div>
                                                )}
                                                <ListItem>
                                                    <ListItemText primaryTypographyProps={{align:'left'}} primary={t('admin.general.numberOfDrives')} />
                                                    <ListItemText primaryTypographyProps={{align:'right'}} primary="0#TODO" />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemText primaryTypographyProps={{align:'left'}} primary={t('admin.general.rate')} />
                                                    <ListItemText primaryTypographyProps={{align:'right'}} primary={user.data().rate} />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemText primaryTypographyProps={{align:'left'}} primary={t('admin.general.active')} />
                                                    <ListItemText primaryTypographyProps={{align:'right'}} primary={active === false ?
                                                        <Icon className="fas fa-times-circle" style={{color:'red'}} /> :
                                                        <Icon className="fas fa-check-square" style={{color:'green'}} />
                                                    } />
                                                </ListItem>
                                            </List>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Card>
                                <CardHeader title={t('admin.driverCenter.driverInformation')}/>
                                <CardContent>
                                    <List>
                                        <ListItem>
                                            <ListItemText primaryTypographyProps={{align:'left'}} primary={t('admin.driverCenter.carDetails.brand')} />
                                            <ListItemText primaryTypographyProps={{align:'right'}} primary={<TextField id="standard-basic" name="brand" value={carBrand} onChange={changeText} />} />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText primaryTypographyProps={{align:'left'}} primary={t('admin.driverCenter.carDetails.model')} />
                                            <ListItemText primaryTypographyProps={{align:'right'}} primary={<TextField id="standard-basic" name="model" value={carModel} onChange={changeText} />} />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText primaryTypographyProps={{align:'left'}} primary={t('admin.driverCenter.carDetails.registrationPlate')} />
                                            <ListItemText primaryTypographyProps={{align:'right'}} primary={<TextField id="standard-basic" name="registration" value={carRegistration} onChange={changeText} />} />
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

export default Driver;
