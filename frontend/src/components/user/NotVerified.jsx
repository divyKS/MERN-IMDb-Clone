import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthProvider'
import { useNavigate } from 'react-router-dom'

const NotVerified = () => {
    const useAuth = useContext(AuthContext)
    console.log(useAuth.authInfo)
    
    const navigate = useNavigate()
    const navigateToVerification = ()=>{
      navigate('/auth/verification', {
        state: {
          user: useAuth.authInfo.profile
        }
      })
    }
  
    return (
        <div className='bg-white -z-10 flex justify-center items-center'>
          {useAuth.authInfo.isLoggedIn && !useAuth.authInfo.profile?.isVerified? (<div className={"max-w-screen-lg mx-auto"}>
            <p className='text-primary bg-blue-50'>
              Looks like you haven't verified your email, <button onClick={navigateToVerification} className='font-semibold hover:underline bg-blue-200'>click here to verify your account</button> .
            </p>
          </div>): null}
        </div>
    )
}

export default NotVerified