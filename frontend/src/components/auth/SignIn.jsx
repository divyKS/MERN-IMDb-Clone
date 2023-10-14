import React, { useContext, useEffect, useState } from "react";
import Title from "../form/Title";
import FormInput from "../form/FormInput";
import Submit from "../form/Submit";
import CustomLink from "../CustomLink";
import { commonModelClasses } from "../../utils/theme";
import FormContainer from "../form/FormContainer";
import { AuthContext } from "../../context/AuthProvider";
import { NotificationContext } from "../../context/NotificationProvider";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });

  const useAuth = useContext(AuthContext);
  const useNotification = useContext(NotificationContext);
  const navigate = useNavigate();

  const validateUserInfo = ({ email, password }) => {
    if (!email.trim()) return { ok: false, error: "Email Missing!" };
    else if (!password.trim()) return { ok: false, error: "Password Missing!" };
    else if (password.length < 8)
      return { ok: false, error: "Password must be 8 characters long!" };
    else return { ok: true, error: "" };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { ok, error } = validateUserInfo(userInfo);
    if (!ok) {
      return useNotification.updateNotification("error", error);
    }
    // handleSubmit function of SignUp was same till above, in SignUp next we directly used the function that made call to the backend and then got the result and did things with it, but in SignIn here, we have first called a function that maintains another state and this function would call the actual function that is making the backend call for signing in, after getting back the response that function makes some changes to that state too
    useAuth.handleLogin(userInfo.email, userInfo.password);
  };

  const handleChange = (e) => {
    const { value, name } = e.target;
    const updatedUserInfo = { ...userInfo };
    updatedUserInfo[name] = value;
    setUserInfo(updatedUserInfo);
  };

  // we are now directing to the home pages from the AuthProvider, the useNavigate('/') there sends the the / of whatever was rendered
  // useEffect(()=>{
  //   if(useAuth.authInfo.isLoggedIn){
  //     // move our user from the signin page to somewhere else
  //     navigate('/')
  //   }
  // },[useAuth.authInfo.isLoggedIn])

  return (
    <FormContainer>
      <div className={"max-w-screen-lg mx-auto"}>
        <form onSubmit={handleSubmit} className={commonModelClasses + "w-72"}>
          <Title content="Sign In"></Title>
          <FormInput
            value={userInfo.email}
            onChange={handleChange}
            inputId="email"
            placeholder="name@provider.com"
            label="Email"
            type="email"
            name="email"
          />
          <FormInput
            value={userInfo.password}
            onChange={handleChange}
            inputId="password"
            placeholder="********"
            label="Password"
            type="password"
            name="password"
          />
          <Submit value="Sign in" busy={useAuth.authInfo.isPending} />
          <div className="flex justify-between">
            <CustomLink to="/auth/forgot-password" content="Forgot Password" />
            <CustomLink to="/auth/signup" content="Sign up" />
          </div>
        </form>
      </div>
    </FormContainer>
  );
};

export default SignIn;
