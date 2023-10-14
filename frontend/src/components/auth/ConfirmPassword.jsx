import React, { useContext, useEffect, useState } from "react";
import Title from "../form/Title";
import FormInput from "../form/FormInput";
import CustomLink from "../CustomLink";
import Submit from "../form/Submit";
import FormContainer from "../form/FormContainer";
import { commonModelClasses } from "../../utils/theme";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LiaSpinnerSolid } from "react-icons/lia";
import { resetPassword, verifyPasswordResetToken } from "../../api/auth";
import { NotificationContext } from "../../context/NotificationProvider";

const ConfirmPassword = () => {
  // we need to get the token and id from the url and for that we will use a new hook useSearchParams
  const [searchParams, setSearchParams] = useSearchParams();
  const [isVerifying, setIsVeryfying] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [password, setPassword] = useState({
    password1: "",
    password2: "",
  });
  const token = searchParams.get("token");
  const userId = searchParams.get("id");
  const useNotification = useContext(NotificationContext);
  const navigate = useNavigate();
  useEffect(() => {
    // whenever we come to the route of this component, start checking the token and id from the url
    isValidToken();
  }, []);

  const isValidToken = async () => {
    const { error, valid } = await verifyPasswordResetToken(token, userId);
    setIsVeryfying(false);
    if (error) {
      navigate("/auth/reset-password", { replace: true });
      return useNotification.updateNotification("error", error);
    }
    if (!valid) {
      setIsValid(false);
      // going to the same route but the token and id will be removed from the url
      return navigate("/auth/reset-password", { replace: true });
    }
    setIsValid(true);
  };

  // check if token is valid or not, display if some verification is under progress, re direct to somewhere else if the credentials aren't correct

  if (isVerifying) {
    return (
      <FormContainer>
        <div className={"max-w-screen-lg mx-auto"}>
          <div className="flex space-x-2 items-center">
            <h1 className="text-3xl font-semibold dark:text-white text-primary ">
              Please wait while we verify the token and id from the url
            </h1>
            <LiaSpinnerSolid className="animate-spin text-3xl dark:text-white text-primary " />
          </div>
        </div>
      </FormContainer>
    );
  }

  if (!isValid && !isVerifying) {
    return (
      <FormContainer>
        <div className={"max-w-screen-lg mx-auto"}>
          <h1 className="text-3xl font-semibold dark:text-white text-primary ">
            Sorry, the token/id are invalid.
          </h1>
        </div>
      </FormContainer>
    );
  }

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setPassword({ ...password, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.password1) {
      return useNotification.updateNotification("error", "Password missing");
    }
    if (password.password1.trim().length < 8) {
      return useNotification.updateNotification(
        "error",
        "Password have to be 8 characters long",
      );
    }
    if (password.password1 !== password.password2) {
      return useNotification.updateNotification(
        "error",
        "Password in both fields have to be same",
      );
    }
    const { error, message } = await resetPassword({
      password: password.password2,
      userId: userId,
      token: token,
    });
    if (error) {
      return useNotification.updateNotification("error", error);
    }
    useNotification.updateNotification("success", message);
    navigate("/auth/signin", { replace: true });
  };

  return (
    <FormContainer>
      <div className={"max-w-screen-lg mx-auto"}>
        <form onSubmit={handleSubmit} className={commonModelClasses + "w-96"}>
          <Title content="Enter New Password"></Title>

          <FormInput
            value={password.password1}
            onChange={handleChange}
            inputId="newPassword"
            placeholder="********"
            label="New Password"
            type="password"
            name="password1"
          />

          <FormInput
            value={password.password2}
            onChange={handleChange}
            inputId="confirmPassword"
            placeholder="********"
            label="Confirm Password"
            type="password"
            name="password2"
          />

          <Submit value="Update Password" />

          <div className="flex justify-between">
            <CustomLink to="/auth/signin" content="Sign in" />
            <CustomLink to="/auth/signup" content="Sign up" />
          </div>
        </form>
      </div>
    </FormContainer>
  );
};

export default ConfirmPassword;
