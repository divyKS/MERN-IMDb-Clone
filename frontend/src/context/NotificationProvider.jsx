// this will be used everywhere inside our app and hence using it as context

import React, { createContext, useState } from 'react'

export const NotificationContext = createContext()

const NotificationProvider = ({children}) => {    
    const [notification, setNotification] = useState('')
    const [classes, setClasses] = useState('')
    let timeoutId;
    
    const updateNotification = (type, value)=>{
        if(timeoutId){
            clearTimeout(timeoutId)
        }
        switch(type){
            case 'error': 
                setClasses('bg-red-500')
                break
            case 'success':
                setClasses('bg-green-500')
                break
            case 'warning':
                setClasses('bg-orange-500')
                break
            default:
                setClasses('bg-red-500')
        }
        setNotification(value)
        timeoutId = setTimeout(()=>{
            setNotification('')
        }, 4000) 
    }


    return (
        <NotificationContext.Provider value={{updateNotification}}>
            {children}
            {/* render the things below iff there is some notification */}
            {notification && 
                <div className='fixed  left-1/2 -translate-x-1/2 top-24'>
                    <div className='bounce-custom rounded shadow-md shadow-gray-400'>
                        <p className={classes + ' text-white px-4 py-1 font-semibold'}>
                            {notification}
                        </p>
                    </div>
                </div>
            } 
        </NotificationContext.Provider>
    )
}

export default NotificationProvider