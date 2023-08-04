import React from "react";
import {Grid, Icon, IconButton, Typography} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import {useTranslation} from "react-i18next";
import IntroBackground from "../Background/IntroBackground";

const styles = {
    input: {
        color: "white"
    }
};


function Intro(props){
    const {t} = useTranslation('common');
    return(
        <div style={{width: '100%', height:'100vh'}}>
            <IntroBackground/>
            <Grid container spacing={3} justify="center" alignItems="center" direction="column" style={{width:'100%', height:'100%'}}>
                <Grid item>
                    <Grid container justify="center" alignItems="center" direction="column">
                        <Grid item>
                            <Typography style={{fontSize:28, color:'white', fontWeight:800, textAlign:'center'}}>{t('intro.mainTitle')}</Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <Typography style={{fontSize:24, color:'white', fontWeight:200, textAlign:'center'}}>{t('intro.subTitle')}</Typography>
                </Grid>
                <Grid item style={{width:'100%', padding:0}}>
                    <Grid container justify="center" direction="row" spacing={1} alignItems="center">
                        <Grid item>
                            <Typography style={{color:'white'}}>{t('intro.newsletterTitle')}</Typography>
                        </Grid>
                        <Grid item>
                            <IconButton aria-label="discord" target="_blank" href="https://discord.gg/ZQMu8JRwtJ">
                                <Icon className="fab fa-discord" style={{color:'white'}} />
                            </IconButton>
                        </Grid>
                    </Grid>

                </Grid>
            </Grid>
        </div>
    )
}

export default withStyles(styles)(Intro);
