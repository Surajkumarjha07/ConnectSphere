'use client'
import { createContext, useContext, useEffect, useState } from 'react';

const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [localUser, setLocalUser] = useState('');

  useEffect(() => {
    let email = sessionStorage.getItem("localUser")
    setLocalUser(email);
  }, [localUser])

    return (
        <>
            <LoginContext.Provider value={{ isLoggedIn, setIsLoggedIn, localUser, setLocalUser }}>
                {children}
            </LoginContext.Provider>
        </>
    )
}

export const useLogin = () => {
    return useContext(LoginContext)
}