import React, {useEffect, useState} from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from "@material-ui/core/Grid";
import {useTranslation} from "react-i18next";
import Base from "./Base";
import CardStats from "../../components/admin/CardStats";
import firebase from "firebase";


function Dashboard() {
    const {t} = useTranslation('common');
    const [stats, setStats] = useState(null);
    const [oldStats, setOldStats] = useState(null);

    useEffect(  () => {
        async function getStats(){
            await firebase.firestore().collection("stats").orderBy("creation_time", "desc").limit(2).get()
                .then((query) => {
                    setStats(query.docs[0].data());
                    setOldStats(query.docs[1].data());
                })
        }
        getStats();
    }, [])

    return (
        <Base>
            <Toolbar />
            <Grid container direction="column" spacing={3}>
                <Grid item>
                    {stats != null && oldStats !== null &&
                        <Grid container direction="row" justify="space-evenly">
                            <Grid item>
                                <CardStats title={t('admin.dashboard.numberOfUsers')} value={stats.users} old={oldStats.users}/>
                            </Grid>
                            <Grid item>
                                <CardStats title={t('admin.dashboard.numberOfDrivers')} value={stats.drivers} old={oldStats.drivers}/>
                            </Grid>
                            <Grid item>
                                <CardStats title={t('admin.dashboard.numberOfDrives')} value={stats.drives} old={oldStats.drives}/>
                            </Grid>
                            <Grid item>
                                <CardStats title={t('admin.dashboard.numberOfTotalDrives')} value={stats.totalDrives} old={oldStats.totalDrives}/>
                            </Grid>
                        </Grid>
                    }
                </Grid>
                <Grid item>
                    {stats != null && oldStats !== null &&
                        <Grid container direction="row" justify="space-evenly">
                            <Grid item>
                                <CardStats title={t('admin.dashboard.numberOfSupportRequest')} value={stats.supportRequest} old={oldStats.supportRequest}/>
                            </Grid>
                            <Grid item>
                                <CardStats title={t('admin.dashboard.numberOfSupportPending')} value={stats.supportPending} old={oldStats.supportPending}/>
                            </Grid>
                            <Grid item>
                                <CardStats title={t('admin.dashboard.numberOfSupportTreated')} value={stats.supportTotal} old={oldStats.supportTotal}/>
                            </Grid>
                        </Grid>
                    }
                </Grid>
            </Grid>
        </Base>
    );
}

export default Dashboard;
