import './App.css'
import NavBar from './components/user/NavBar'
import SignIn from './components/auth/SignIn'
import SignUp from './components/auth/SignUp'
import {Route, Routes, BrowserRouter as Router} from "react-router-dom"
import HomePage from './components/HomePage'
import ForgetPassword from './components/auth/ForgetPassword'
import EmailVerification from './components/auth/EmailVerification'
import ConfirmPassword from './components/auth/ConfirmPassword'
import ThemeProvider, { ThemeContext } from './context/ThemeProvider'
import NotFound from './components/NotFound'
import NotificationProvider from './context/NotificationProvider'
import AuthProvider from './context/AuthProvider'

function App() {
  return (
    <>
      <ThemeProvider>
      <NotificationProvider>
      <AuthProvider>
        <Router>
          <NavBar></NavBar>          
          <Routes>
            <Route path='/' element={<HomePage/>}></Route>
            <Route path='/auth/signin' element={<SignIn/>}></Route>
            <Route path='/auth/signup' element={<SignUp/>}></Route>
            <Route path='/auth/verification' element={<EmailVerification/>}></Route>
            <Route path='/auth/forgot-password' element={<ForgetPassword/>}></Route>
            <Route path='/auth/reset-password' element={<ConfirmPassword/>}></Route>
            <Route path='*' element={<NotFound/>}></Route>

          </Routes>
        </Router>
      </AuthProvider>  
      </NotificationProvider>
      </ThemeProvider> 
    </>
  )
}

export default App
