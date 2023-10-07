import React, { useContext, useEffect, useState } from 'react'
import Title from '../form/Title'
import FormInput from '../form/FormInput'
import Submit from '../form/Submit'
import CustomLink from '../CustomLink'
import { commonModelClasses } from '../../utils/theme'
import FormContainer from '../form/FormContainer'
import { createUser } from '../../api/auth'
import { useNavigate } from 'react-router-dom'
import { NotificationContext } from '../../context/NotificationProvider'
import { AuthContext } from '../../context/AuthProvider'

const SignUp = () => {

  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    password:''
  })
  const {name, email, password} = userInfo
  
  const navigate = useNavigate() // to be able to go to the otp page if the signup wass successful

  const useNotification = useContext(NotificationContext)

  const useAuth = useContext(AuthContext)

  const handleChange = (e) => {
    const {value, name} = e.target
    const updatedUserInfo = {...userInfo} // we have to destructure so that we get a copy of that object, otherwise we will end up changing the original object
    updatedUserInfo[name] = value
    setUserInfo(updatedUserInfo)
    //  console.log(e.target.value, e.target.name)
  }

  const validateUserInfo = ({name, email, password})=>{
    if(!name.trim()) return {"ok": false, "error": "Name Missing!"}
    else if(!email.trim()) return {"ok": false, "error": "Email Missing!"}
    // can do util/helper.js use the isValidEmail function inside of it here and use if conditions instead
    else if(!password.trim()) return {"ok": false, "error": "Password Missing!"}
    else if(password.length < 8) return {"ok": false, "error": "Password must be 8 characters long!"}
    else return {"ok": true, "error": ""}
  }

  const handleSubmit = async (e)=>{
    e.preventDefault()
    const {ok, error} = validateUserInfo(userInfo)
    if(!ok){
      const value = error
      return useNotification.updateNotification('error', value)
    }
    // console.log(userInfo) 
    //now we will use this userInfo to send this to our backend
    // for better readibility we are not putting that logic inside our component, we are making another folder api and inside that in client we are doing the fetch etc
    const response = await createUser(userInfo);
    if(response.error){
      return useNotification.updateNotification('error', response.error)
      // return console.log(response.error) // we will render it inside out app too later
    } 

    navigate('/auth/verification', {
      state: {user: response.user}, 
      replace: true
    }) // to render the EmailVerification, OTP component
    // with the replace, if the user ends up on otp screen they can't go back on the signup page, that will be replaced from the history permanently
    // the state can be made available in the auth/verification component by using useLocation hook there

    console.log(response.user)
  }

  useEffect(()=>{
    if(useAuth.authInfo.isLoggedIn){
      navigate('/')
    }
  },[useAuth.authInfo.isLoggedIn])

  return (
    <FormContainer>
      <div className={"max-w-screen-lg mx-auto"}>
       
      <form onSubmit={handleSubmit} className={commonModelClasses + "w-72"}>
        
        <Title content="Sign Up"></Title>

        <FormInput 
          value={name}
          onChange={handleChange}
          label='Name'
          placeholder='John Doe'
          name='name' 
          type='text'
        />

        <FormInput 
          value={email}
          onChange={handleChange}
          label='Email'
          placeholder='john@doe.com'
          name='email' 
          type='email'
        />

        <FormInput
          value={password}
          onChange={handleChange}
          label='Password'
          placeholder='********'
          name='password' 
          type='password'
        />

        <Submit value='Sign up'/>
          
        <div className="flex justify-between">
        <CustomLink
          to='/auth/forgot-password'
          content='Forgot Password'
        />
        <CustomLink
          to='/auth/signin'
          content='Sign In'
        />
        </div> 

        </form>
      </div>
    </FormContainer>
  )
}

export default SignUp