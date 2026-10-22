import {createContext, useState} from "react";
import {useNavigate} from "react-router";
import usePersistedState from "../hooks/usePersistedState.js";
import {mutate} from "../ utils/request.js";
import { decodeToken } from "../ utils/decode.js";
import {publicRoutes} from "../ utils/ApplicationUrlPaths.js";

const AuthContext = createContext({
    token: '',
    user: {},
    isAuthenticated: false,
    login() {},
    register() {},
    errors: null,
    loading: false,
    clearErrors() {},
});

export function AuthProvider({ children }) {

    const navigate = useNavigate();

    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(false);
    const [auth, setAuth] = usePersistedState('auth', null);

    const register = async (userData) => {
        setLoading(true);
        setErrors(null);

        try{
            const {token} = await mutate('POST', '/api/auth/register', userData);

            setAuth({token, user: decodeToken(token)})

            navigate(publicRoutes.home)
        }
        catch(error){
            setErrors(error);
        }
        finally {
            setLoading(false);
        }
    };

    const login = async (userData) => {
        setLoading(true);
        setErrors(null);

        try{
            const {token} = await mutate('POST', '/api/auth/login', userData);

            setAuth({token, user: decodeToken(token)});

            navigate(publicRoutes.home)
        }
        catch(error){
            setErrors(error);
        }
        finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await mutate('POST', '/api/auth/logout');
        }
        catch {
            // expired or invalid token — the local session goes either way
        }

        setAuth(null);

        navigate(publicRoutes.home);
    };

    const clearErrors = () => setErrors(null);

    const contextValue = {
        accessToken: auth?.token,
        user: auth?.user,
        isAuthenticated: !!auth && decodeToken(auth.token).expiresAt > Date.now(),
        register,
        login,
        logout,
        errors,
        loading,
        clearErrors,
    };

    return(
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
