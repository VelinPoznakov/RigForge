import {Navigate, Outlet} from "react-router";
import useAuth from "../hooks/useAuth.js";
import {publicRoutes} from "../ utils/ApplicationUrlPaths.js";

export default function RouteGuard(){

    const {isAuthenticated} = useAuth();

    if(!isAuthenticated)
        return <Navigate to={publicRoutes.login} replace />;

    return(
        <Outlet />
    );
}