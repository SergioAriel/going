"use client"

import { createContext, useContext, useState } from "react"

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
                    <div
                        className="relative w-screen z-50"
                    >
                        <div
                            className={`
                                fixed left-1/2 -translate-x-1/2 top-10 p-4 pt-7 rounded-md w-1/2 min-h-20 text-wrap flex items-center justify-center  bg-gray-700 font-semibold
                                ${alert.isError && "text-red-500 "}   
                            `}
                        >
                            <button
                                type="button"
                                onClick={() => setAlert({ ...alert, status: false })}
                                className="absolute top-2 right-2 bg-gray-400 text-white rounded-full h-5 w-5"
                            >
                                <span className=" inline-block -translate-y-[15%]">
                                    &times;
                                </span>
                            </button>
                            <span className="w-full break-words">
                                {alert.message} 
                            </span>

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