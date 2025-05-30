"use client"

import { createContext, useContext, useEffect, useState } from "react"

interface Alert {
    status: boolean,
    message: string,
    isError: boolean
}

interface AlertContextType extends Alert {
    handleAlert: (info: { message: string, isError: boolean }) => void
}

const AlertContext = createContext<AlertContextType | undefined>(undefined)

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
    const [alert, setAlert] = useState<Alert>({
        status: false,
        message: "",
        isError: false
    })

    useEffect(()=>{
        if(alert.status){
            setTimeout(()=>{
                setAlert({
                    ...alert,
                    status:false
                })
            },3000)
        }
    },[alert])

    const handleAlert = (info: { message: string, isError: boolean }) => {
        setAlert({
            ...info,
            status: true
        })
    }

    return (
        <AlertContext.Provider
            value={{ ...alert, handleAlert }}
        >
            <>
                {
                    alert.status &&
                    <div className="fixed left-1/2 -translate-x-1/2 top-8 z-50 w-full flex justify-center pointer-events-none">
                        <div
                            className={`
                                relative flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg min-w-[320px] max-w-md w-full
                                ${alert.isError
                                    ? "bg-red-50 border border-red-400 text-red-700"
                                    : "bg-green-50 border border-green-400 text-green-700"
                                }
                                pointer-events-auto
                                animate-fade-in
                            `}
                        >
                            <span className="text-2xl">
                                {alert.isError ? "❌" : "✅"}
                            </span>
                            <span className="flex-1 font-medium break-words">
                                {alert.message}
                            </span>
                            <button
                                type="button"
                                onClick={() => setAlert({ ...alert, status: false })}
                                className="absolute top-2 right-2 text-lg text-gray-400 hover:text-gray-700 transition-colors"
                                aria-label="Cerrar alerta"
                            >
                                &times;
                            </button>
                        </div>
                    </div>
                }
                {children}
            </>
        </AlertContext.Provider>
    )
}

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error("useAlert must be used within a AlertProvider");
    }
    return context;
};