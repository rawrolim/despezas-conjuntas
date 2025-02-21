'use client'
import React, { createContext, ReactNode, useEffect } from "react";
import useLocalStorage from '@/hooks/useLocalStorage';

export interface IUserStateContextProps {
    user: any;
    setUser: (value: any) => void
}

export const UserStateContext = createContext<IUserStateContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useLocalStorage("user", "");
    
    useEffect(() => {
        require("bootstrap/dist/js/bootstrap.min.js");
    }, []);

    return (
        <UserStateContext.Provider value={{ user, setUser }}>
            {children}
        </UserStateContext.Provider>
    )
}