import React from "react";
import CustomDrawer from "../../components/admin/CustomDrawer";
import {AppBar} from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import LanguageIcon from "@material-ui/icons/Language";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";
import Container from "@material-ui/core/Container";
import firebase from "firebase";
import * as Routes from "../../navigation/Routes";

function Base(props){
    const {t, i18n} = useTranslation('common');
    const history = useHistory();

    const logout = async () => {
        firebase.auth().signOut().then(function() {
            history.push(Routes.HOME);
        }, function(error) {
            console.log("Error", error);
        });
    }

    return (
        <div style={{display:'flex'}}>
            <AppBar position="fixed" style={{zIndex:2000}}>
                <Container maxWidth="lg">
                    <Toolbar>
                        <Grid container justify="space-between" alignItems="baseline">
                            <Grid item onClick={() => history.push('/admin')} style={{cursor: 'pointer'}}>
                                <Grid container>
                                    <Grid item>
                                        <Typography variant="h6">
                                            BeDriv
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Grid container justify="flex-end" alignitems="baseline">
                                    <Grid item>
                                        <Button onClick={() => logout()} color="inherit">{t('general.logout')}</Button>
                                    </Grid>
                                    <Grid item>
                                        {i18n.language === "fr"
                                            ?
                                            <Button color="inherit" variant="outlined" onClick={() => i18n.changeLanguage('en')} startIcon={<LanguageIcon/>}>EN</Button>
                                            :
                                            <Button color="inherit" variant="outlined" onClick={() => i18n.changeLanguage('fr')} startIcon={<LanguageIcon/>}>FR</Button>
                                        }
                                    </Grid>

                                </Grid>
                            </Grid>
                        </Grid>
                    </Toolbar>
                </Container>
            </AppBar>
            <CustomDrawer/>
            <main style={{flexGrow: 1, padding: 10}}>
                {props.children}
            </main>
        </div>
    )
}
export default Base;
