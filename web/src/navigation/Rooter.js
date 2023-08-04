import React from "react";
import {Switch, Route, BrowserRouter, Redirect} from 'react-router-dom';
import Home from "../views/Home";
import * as Routes from "./Routes";
import Login from "../views/Login";
import Process from "../views/Process";
import firebase from "firebase";
import CustomStepper from "../views/process/CustomStepper";
import Dashboard from "../views/admin/Dashboard";
import SupportCenter from "../views/admin/SupportCenter";
import DriverCenter from "../views/admin/DriverCenter";
import Driver from "../views/admin/Driver";
import UserCenter from "../views/admin/UserCenter";
import User from "../views/admin/User";
import Support from "../views/admin/Support";

function Rooter(){

    async function requireAuth(nextState, replace, next){
        await firebase.auth().onAuthStateChanged(function(user) {
            return !!user;
        });
    }

    const ProtectedRoute = ({ component: Comp, loggedIn, exact, path, ...rest }) => {
        return (
            <Route
                path={path}
                {...rest}
                render={(props) => {
                    return loggedIn ? <Comp {...props} /> : <Redirect to="/login" />;
                }}
            />
        );
    };

    return(
        <BrowserRouter>
            <Switch>
                <Route exact path={Routes.HOME} component={Home} />
                <Route exact path={Routes.LOGIN} component={Login} />
                <ProtectedRoute exact path={Routes.PROCESS} component={Process} loggedIn={requireAuth}/>
                <ProtectedRoute exact path={Routes.PROCESS_DOC} component={CustomStepper} loggedIn={requireAuth}/>
                <ProtectedRoute exact path={Routes.ADMIN} component={Dashboard} loggedIn={requireAuth}/>
                <ProtectedRoute exact path={Routes.ADMIN_SUPPORT_CENTER} component={SupportCenter} loggedIn={requireAuth}/>
                <ProtectedRoute exact path={Routes.ADMIN_SUPPORT_MESSAGE} component={Support} loggedIn={requireAuth}/>
                <ProtectedRoute exact path={Routes.ADMIN_DRIVER_CENTER} component={DriverCenter} loggedIn={requireAuth}/>
                <ProtectedRoute exact path={Routes.ADMIN_DRIVER} component={Driver} loggedIn={requireAuth}/>
                <ProtectedRoute exact path={Routes.ADMIN_USER_CENTER} component={UserCenter} loggedIn={requireAuth}/>
                <ProtectedRoute exact path={Routes.ADMIN_USER} component={User} loggedIn={requireAuth}/>
            </Switch>
        </BrowserRouter>
    )
}

export default Rooter;
