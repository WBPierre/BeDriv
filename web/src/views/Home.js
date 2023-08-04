import React from "react";
import Base from "./Base";
import {Container, Grid, Typography} from "@material-ui/core";
import Intro from "../components/Home/Intro";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Footer from "../components/footer/Footer";
import Photo1 from "../assets/img/home/photo1.jpg";
import Photo2 from "../assets/img/home/photo2.jpg";
import {useTranslation} from "react-i18next";

function Home(){
    const {t} = useTranslation('common');
    return (
        <Base>
            <Intro/>
            <Container>
                <Grid container direction="column" style={{width:'100%', marginTop:'10%', marginBottom:'10%'}}>
                    <Grid item>
                        <Grid container direction="row" justify="space-around" alignItems="center">
                            <Grid item>
                                <Typography style={{fontSize: 28, fontWeight: 800}}>{t('home.layerOne.winMore')}</Typography>
                                <Typography style={{fontSize: 24}}>{t('home.layerOne.subTitle')}</Typography>
                            </Grid>
                            <Grid item>
                                <Button variant="contained" color="primary">
                                    {t('home.layerOne.signUpAsDriver')}
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Divider light/>
                <Grid container direction="column" spacing={10} style={{width:'100%', marginTop:'5%', marginBottom:'5%'}}>
                    <Grid item>
                        <Grid container direction="row" spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Grid container direction="column">
                                    <Grid item>
                                        <Typography style={{fontSize: 28, fontWeight: 800}}>{t('home.layerTwo.firstGrid.title')}</Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography>{t('home.layerTwo.firstGrid.text')}</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <img src={Photo2} alt="1" style={{width:'100%', height:'100%'}}/>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Divider light/>
                    <Grid item>
                        <Grid container direction="row" spacing={3}>
                            <Grid item xs={12} md={6}>
                                <img src={Photo1} alt="2" style={{width:'100%', height:'100%'}}/>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Grid container direction="column">
                                    <Grid item>
                                        <Typography style={{fontSize: 28, fontWeight: 800}}>{t('home.layerTwo.secondGrid.title')}</Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography>
                                            {t('home.layerTwo.secondGrid.text')}
                                        </Typography>
                                        <ul>
                                            <li>
                                                <Typography>{t('home.layerTwo.secondGrid.list.one')}</Typography>
                                            </li>
                                            <li>
                                                <Typography>{t('home.layerTwo.secondGrid.list.two')}</Typography>
                                            </li>
                                            <li>
                                                <Typography>{t('home.layerTwo.secondGrid.list.three')}</Typography>
                                            </li>
                                            <li>
                                                <Typography>{t('home.layerTwo.secondGrid.list.four')}</Typography>
                                            </li>
                                            <li>
                                                <Typography>{t('home.layerTwo.secondGrid.list.five')}</Typography>
                                            </li>
                                        </ul>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Divider light />
                <Grid container direction="row" spacing={3} style={{width:'100%', marginTop:'5%'}}>
                    <Grid item xs={12} md={4}>
                        <Grid container direction="column">
                            <Grid item>
                                <Typography style={{fontSize: 28, fontWeight: 800}}>{t('home.layerThree.first.title')}</Typography>
                            </Grid>
                            <Grid item>
                                <Typography>{t('home.layerThree.first.text')}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Grid container direction="column">
                            <Grid item>
                                <Typography style={{fontSize: 28, fontWeight: 800}}>{t('home.layerThree.second.title')}</Typography>
                            </Grid>
                            <Grid item>
                                <Typography>{t('home.layerThree.second.text')}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Grid container direction="column">
                            <Grid item>
                                <Typography style={{fontSize: 28, fontWeight: 800}}>{t('home.layerThree.third.title')}</Typography>
                            </Grid>
                            <Grid item>
                                <Typography>{t('home.layerThree.third.text')}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container spacing={5} direction="column" justify="center" alignItems="center" style={{width:'100%', marginTop:'10%', marginBottom:'5%'}}>
                    <Grid item>
                        <Typography style={{fontSize: 28, fontWeight: 800}}>{t('home.layerFour.title')} ? </Typography>
                    </Grid>
                    <Grid item>
                        <Button>{t('home.layerFour.text')}</Button>
                    </Grid>
                </Grid>
            </Container>
            <Footer/>
        </Base>
    );
}

export default Home;
