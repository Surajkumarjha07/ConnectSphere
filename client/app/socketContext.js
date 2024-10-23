'use client'
import { createContext, useContext, useEffect, useMemo } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const socket = useMemo(() => {
        const newSocket = io("http://127.0.0.1:8000", {
            withCredentials: true,
        })

        newSocket.on("connect", () => {
            console.log(socket.id);
        });

        return newSocket;
    }, []);

    return (
        <>
            <SocketContext.Provider value={{ socket }}>
                {children}
            </SocketContext.Provider>
        </>
    )
}

export const useSocket = () => {
    return useContext(SocketContext)
}