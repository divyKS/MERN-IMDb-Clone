import React, { createContext, useContext, useEffect, useState } from 'react'
import { getIsAuth, signInUser } from '../api/auth';
import { NotificationContext } from './NotificationProvider';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

// needed like this to handle things at the logout
const defaultAuthInfo = {
    profile: null,
    isLoggedIn: false,
    isPending: false, 
    error: ''
}

const AuthProvider = ({children}) => {
    const [authInfo, setAuthInfo] = useState({...defaultAuthInfo})
    const useNotification = useContext(NotificationContext)
    
    const navigate = useNavigate()

    const handleLogin = async (email, password)=>{
        setAuthInfo({...authInfo, isPending: true})
        const {error, user} = await signInUser({email, password})
        if(error){
            useNotification.updateNotification("error", error)
            return setAuthInfo({...authInfo, "isPending": false, "error": error})
        }
        navigate('/', {replace: true})
        setAuthInfo({
            "profile": {...user}, 
            "isPending": false,
             "isLoggedIn": true,
            "error": error
        })
        localStorage.setItem('auth-token', user.token)
    }

    const handleLogout = ()=>{
        localStorage.removeItem('auth-token')
        setAuthInfo({...defaultAuthInfo})
    }

    const isAuth = async()=>{
        const token = localStorage.getItem('auth-token')
        if(!token){
            return;
        }
        setAuthInfo({...authInfo, "isPending": true})
        // now we will check if this token is correct or not
        const {error, user} = await getIsAuth(token)
        if(error){
            return setAuthInfo({...authInfo, "isPending": false, "error": error})
        }
        setAuthInfo({
            profile: { ...user },
            isLoggedIn: true,
            isPending: false,
            error: "",
          });
    }

    // this helps in checking if the user is loggedin or not automatically if he goes on the login page, it runs the isAuth function automatically without filling in the email and password, if the token is present and valid then we know that the user is logged in
    useEffect(()=>{
        isAuth();
    }, [])

    return (
        // we are exporting the state too authInfo, hence it can be accessed
        <AuthContext.Provider value={{authInfo, handleLogin, handleLogout, isAuth}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider