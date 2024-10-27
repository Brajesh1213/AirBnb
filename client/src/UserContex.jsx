import axios from "axios";
// import { createContext, useState } from "react"
// src/UserContext.jsx
import { createContext,useEffect,useState } from 'react';

// Create a context with a default value (can be an empty object)
export const UserContext = createContext({});



export function UserContexProvidor({children}){
    const [user,setUser]=useState(null);
    const [ready,setReady] = useState(false);
    useEffect( ()=>{
        if(!user){
          const {data}=  axios.get('user/profile').then(({data})=>setUser(data));
            setUser(data);
            setReady(true);
        }
    },[]);
    return(
        <UserContext.Provider value={{user,setUser,ready}}>
                {children} 

        </UserContext.Provider>
);
}