import React from "react";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import {useTranslation} from "react-i18next";
import LanguageIcon from '@material-ui/icons/Language';
import {useHistory} from "react-router-dom";

function ApplicationBar(props){
    const {t, i18n} = useTranslation('common');
    const history = useHistory();

    function goToLogin(){
        history.push("/login");
    }

    return(
        <div>
            <AppBar position="static" style={{ backgroundColor: '#283149', zIndex:2000}}>
                <Container maxWidth="lg">
                    <Toolbar>
                        <Grid container justify="space-between" alignItems="baseline">
                            <Grid item onClick={() => history.push('/')} style={{cursor: 'pointer'}}>
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
                                    {props.login === true &&
                                        <Grid item>
                                            <Button color="inherit" onClick={goToLogin}>{t('appBar.myAccount')}</Button>
                                        </Grid>
                                    }
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
        </div>
    );
}


export default ApplicationBar;
