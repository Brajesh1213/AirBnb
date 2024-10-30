import axios from "axios";
import { createContext,useEffect,useState } from 'react';

export const UserContext = createContext({});



export function UserContexProvidor({children}){

    const [user,setUser]=useState(null);
    const [ready,setReady] = useState(false);
    useEffect( ()=>{
        if(!user){
          const {data}=  axios.get('/api/house_owner/profile').then(({data})=>setUser(data));

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

/**import axios from "axios";
import { createContext, useEffect, useState } from 'react';

// Create a context with a default value (can be an empty object)
export const UserContext = createContext({});

export function UserContextProvider({ children }) {
    const [user, setUser] = useState(() => {
        // Retrieve user data from localStorage if it exists
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (!user) {
            axios.get('/api/house_owner/profile')
                .then(({ data }) => {
                    setUser(data);
                    localStorage.setItem('user', JSON.stringify(data)); // Store user in localStorage
                    setReady(true);
                })
                .catch((error) => {
                    console.error("Error fetching user profile:", error);
                    setReady(true);
                });
        } else {
            setReady(true);
        }
    }, [user]);

    return (
        <UserContext.Provider value={{ user, setUser, ready }}>
            {children}
        </UserContext.Provider>
    );
}
 */