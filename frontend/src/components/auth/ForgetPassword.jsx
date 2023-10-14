import React, { useContext, useState } from "react";
import Title from "../form/Title";
import FormInput from "../form/FormInput";
import CustomLink from "../CustomLink";
import Submit from "../form/Submit";
import FormContainer from "../form/FormContainer";
import { commonModelClasses } from "../../utils/theme";
import { forgotPassword } from "../../api/auth";
import { isValidEmail } from "../../utils/helper";
import { NotificationContext } from "../../context/NotificationProvider";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const useNotification = useContext(NotificationContext);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isValidEmail(email)) {
      useNotification.updateNotification(
        "error",
        "Email does not match email regex, invalid email",
      );
    }
    const { error, message } = await forgotPassword(email);
    if (error) {
      return useNotification.updateNotification("error", error);
    }
    useNotification.updateNotification("success", message);
  };

  const handleChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
  };

  return (
    <FormContainer>
      <div className={"max-w-screen-lg mx-auto"}>
        <form onSubmit={handleSubmit} className={commonModelClasses + "w-96"}>
          <Title content="Please Enter Your Email"></Title>

          <FormInput
            onChange={handleChange}
            inputId="email"
            placeholder="name@provider.com"
            label="Email"
            type="email"
            name="email"
          />

          <Submit value="Send Reset Link" />

          <div className="flex justify-between">
            <CustomLink to="/auth/signin" content="Sign in" />
            <CustomLink to="/auth/signup" content="Sign up" />
          </div>
        </form>
      </div>
    </FormContainer>
  );
};

export default ForgetPassword;
