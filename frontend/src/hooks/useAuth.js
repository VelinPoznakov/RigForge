import {useContext} from "react";
import AuthContext from "../contexts/authContext.jsx";

export default function useAuth(){
    return useContext(AuthContext)
}