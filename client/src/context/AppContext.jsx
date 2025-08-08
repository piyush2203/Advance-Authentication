/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";

import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props)=>{

    const backendUrl = import.meta.env.VITE_BACKEND_URL  //this is how we use .env in frontend
    const [isLoggedIn, setisLoggedIn] = useState(false);
    const [userData, setuserData] = useState(false);

    const getUserData =async()=>{
        try {
            const {data} = await axios.get(backendUrl + "/api/user/data");
            data.success ? setuserData(data.userData) : toast.error(data.message);
        } catch (error) {
            toast.error(error.message);
        }
    }
    
    const value = {
        backendUrl,
        isLoggedIn,setisLoggedIn,
        userData,setuserData,
        getUserData
    };

    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}