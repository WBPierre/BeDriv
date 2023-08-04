import React from "react";
import Container from "@material-ui/core/Container";
import {Button, Typography} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import GoogleBadge from "../../assets/img/badges/google-play-badge.png"
import AppleBadge from "../../assets/img/badges/app-store-badge.png"
import FacebookIcon from '@material-ui/icons/Facebook';
import {Instagram, Twitter} from "@material-ui/icons";
import {useTranslation} from "react-i18next";

function Footer(){
    const {t} = useTranslation('common');


    return(
        <div style={{width:'100%', backgroundColor:'#161B28'}}>
            <Container style={{paddingTop:"2%"}}>
                <Typography style={{fontSize: 28, fontWeight: 800, color:'white'}}>BeDriv</Typography>
                <Grid container direction="row" spacing={5} style={{marginTop:'2%'}}>
                    <Grid item style={{flex:1}}>
                        <Grid container direction="column" spacing={1}>
                            <Grid item>
                                <Typography style={{fontSize: 24, color:'white'}}>{t('footer.company')}</Typography>
                            </Grid>
                            <Grid item>
                                <Button color="secondary" style={{color:'white'}}>{t('footer.aboutUs')}</Button>
                            </Grid>
                            <Grid item>
                                <Button color="secondary" style={{color:'white'}}>{t('footer.whitepaper')}</Button>
                            </Grid>
                            <Grid item>
                                <Button color="secondary" style={{color:'white'}}>{t('footer.policy')}</Button>
                            </Grid>
                            <Grid item>
                                <Button color="secondary" style={{color:'white'}}>{t('footer.press')}</Button>
                            </Grid>
                            <Grid item>
                                <Button color="secondary" style={{color:'white'}}>{t('footer.joinUs')}</Button>
                            </Grid>

                        </Grid>
                    </Grid>
                    <Grid item style={{flex:1}}>
                        <Grid container direction="column" spacing={1}>
                            <Grid item>
                                <Typography style={{fontSize: 24, color:'white'}}>{t('footer.services')}</Typography>
                            </Grid>
                            <Grid item>
                                <Button color="secondary" style={{color:'white'}}>{t('footer.passengers')}</Button>
                            </Grid>
                            <Grid item>
                                <Button color="secondary" style={{color:'white'}}>{t('footer.drivers')}</Button>
                            </Grid>
                            <Grid item>
                                <Button color="secondary" style={{color:'white'}}>{t('footer.influencers')}</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container direction="row" spacing={5} justify="center" alignItems="center" style={{marginTop:'2%'}}>
                    <Grid item style={{flex:1}}>
                        <Grid container direction="row" justify="space-evenly" style={{color:'white'}}>
                            <Grid item>
                                <FacebookIcon/>
                            </Grid>
                            <Grid item>
                                <Twitter/>
                            </Grid>
                            <Grid item>
                                <Instagram/>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item style={{flex:1}}>
                        <Grid container direction="row" spacing={1}>
                            <Grid item >
                                <img src={GoogleBadge} alt="Google-Badge" style={{height:100}}/>
                            </Grid>
                            <Grid item>
                                <img src={AppleBadge} alt="Apple-Badge" style={{height:100}}/>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container direction="row" justify="center" alignItems="center" style={{marginTop:'2%'}}>
                    <Typography style={{color:'white'}}>&#169; 2021 BeDriv</Typography>
                </Grid>
            </Container>
        </div>
    )

}


export default Footer;
