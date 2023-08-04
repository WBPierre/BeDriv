import React from "react";
import {Drawer, List, ListItem, ListItemText, makeStyles} from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import Toolbar from "@material-ui/core/Toolbar";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";
import * as Routes from "../../navigation/Routes";

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerContainer: {
        overflow: 'auto',
    },
}));

function CustomDrawer(){
    const classes = useStyles();
    const {t} = useTranslation('common');
    const history = useHistory();

    function goToSupport(){
        history.push(Routes.ADMIN_SUPPORT_CENTER);
    }

    function goToDriver(){
        history.push(Routes.ADMIN_DRIVER_CENTER);
    }

    function goToUser(){
        history.push(Routes.ADMIN_USER_CENTER);
    }


    return(
        <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{
                paper: classes.drawerPaper,
            }}
        >
            <Toolbar/>
            <div className={classes.drawerContainer}>
                <List>
                    <ListItem button onClick={() => history.push('/admin')}>
                        <ListItemText primary={"Dashboard"} />
                    </ListItem>
                </List>
                <Divider />
                <List>
                    <ListItem button onClick={goToUser}>
                        <ListItemText primary={t('admin.general.userCenter')} />
                    </ListItem>
                </List>
                <Divider />
                <List>
                    <ListItem button onClick={goToDriver}>
                        <ListItemText primary={t('admin.general.driverCenter')} />
                    </ListItem>
                </List>
                <Divider />
                <List>
                    <ListItem button onClick={goToSupport}>
                        <ListItemText primary={t('admin.general.support')} />
                    </ListItem>
                </List>
            </div>
        </Drawer>
    )
}

export default CustomDrawer;
