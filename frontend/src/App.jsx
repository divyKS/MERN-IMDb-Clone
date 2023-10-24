import "./App.css";
import NavBar from "./components/user/NavBar";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import { Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import ForgetPassword from "./components/auth/ForgetPassword";
import EmailVerification from "./components/auth/EmailVerification";
import ConfirmPassword from "./components/auth/ConfirmPassword";
import { ThemeContext } from "./context/ThemeProvider";
import NotFound from "./components/NotFound";
import { AuthContext } from "./context/AuthProvider";
import { useContext } from "react";
import AdminNavigator from "./navigator/AdminNavigator";
import SingleMovie from "./components/user/SingleMovie";

function App() {
  const useAuth = useContext(AuthContext);
  const isAdmin = useAuth.authInfo.profile?.role === "admin";

  if (isAdmin) return <AdminNavigator />;

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/auth/signin" element={<SignIn />}></Route>
        <Route path="/auth/signup" element={<SignUp />}></Route>
        <Route path="/auth/verification" element={<EmailVerification />}></Route>
        <Route path="/auth/forgot-password" element={<ForgetPassword />}></Route>
        <Route path="/auth/reset-password" element={<ConfirmPassword />}></Route>
        <Route path="/movie/:movieId" element={<SingleMovie/>}></Route>
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </>
  );
}

export default App;
