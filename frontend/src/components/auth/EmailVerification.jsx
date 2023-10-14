import React, { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Title from "../form/Title";
import Submit from "../form/Submit";
import FormContainer from "../form/FormContainer";
import { commonModelClasses } from "../../utils/theme";
import { resendEmailVerificationToken, verifyUserEMail } from "../../api/auth";
import { NotificationContext } from "../../context/NotificationProvider";
import { AuthContext } from "../../context/AuthProvider";

let currentOTPIndex;

const isValidOTP = (otp) => {
  for (let element of otp) {
    if (isNaN(parseInt(element))) {
      return false;
    }
  }
  return true;
};

const EmailVerification = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [activeOtpIndex, setActiveOtpIndex] = useState(0);

  const inputRef = useRef(); // we can create a ref hook like this and then pass it to any html element by addding attribute ref
  // here what we are doing is to create input only if activeOtpIndex === index

  const { state } = useLocation();
  const user = state?.user;

  const navigate = useNavigate();

  const useNotifcation = useContext(NotificationContext);
  const useAuth = useContext(AuthContext);
  // console.log(useAuth.authInfo)

  const focusOnPreviousOTPField = (index) => {
    if (index === 0) {
      setActiveOtpIndex(0);
    } else {
      setActiveOtpIndex(index - 1);
    }
  };

  const focusOnNextOTPField = (index) => {
    setActiveOtpIndex(index + 1);
  };

  const handleOTPChange = (e, index) => {
    const value = e.target.value;
    // console.log(`Value = ${value} entered in OTP at index = ${index}`);
    const updatedOtp = [...otp];
    updatedOtp[currentOTPIndex] = value.substring(
      value.length - 1,
      value.length,
    ); // because of this only the last things that we entered comes into the otp, we can now not more than 1 digit in one box
    if (!value) {
      // means backspace was hit
      focusOnPreviousOTPField(currentOTPIndex);
    } else {
      focusOnNextOTPField(currentOTPIndex);
    }
    setOtp(updatedOtp);
    // console.log(updatedOtp)
  };

  const handleOnKeyDown = (e, index) => {
    // this function will run before handleOTPChange, becausee onKeyDown will run before onChange in react 18+, hence currentOTPIndex will not be undefined
    currentOTPIndex = index;
    if (e.key === "Backspace") {
      focusOnPreviousOTPField(currentOTPIndex);
    }
  };

  useEffect(() => {
    // if the current exits, then focus it, and run this everytime when the activeOtpIndex changes, and it changes whenever we enter into the otp
    inputRef.current?.focus();
  }, [activeOtpIndex]);

  // if no user was found from the navigate thing from the SignUp then there is no point in rendering this component
  // if(!user) return null

  // comment this out if you want to check this component working
  useEffect(() => {
    // so now only the valid unique users can go to this otp page, if they are not, or if they try to directly go to this route they can't do so, they'll be redired to not found
    if (!user) navigate("/not-found");
    if (useAuth.authInfo.isLoggedIn && useAuth.authInfo.profile?.isVerified) {
      navigate("/");
    }
  }, [user, useAuth.authInfo.isLoggedIn, useAuth.authInfo.profile?.isVerified]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // before sending out OTP we will have to validate our OTP form
    if (!isValidOTP(otp)) {
      return useNotifcation.updateNotification(
        "error",
        "Enter all 6 digits for the OTP",
      );
    }
    console.log(user);
    const {
      error,
      message,
      user: userResponse,
    } = await verifyUserEMail({ OTP: otp.join(""), userId: user.id }); // capital OTP since that is how we destructured it in our backend function
    if (error) {
      return useNotifcation.updateNotification("error", error);
    }
    useNotifcation.updateNotification("success", message);
    localStorage.setItem("auth-token", userResponse.token);
    useAuth.isAuth();
  };

  const handleOTPResend = async () => {
    console.log(useAuth.authInfo);
    const userId = useAuth.authInfo.profile?.userId;
    const { error, message } = await resendEmailVerificationToken(userId);
    if (error) {
      return useNotifcation.updateNotification("error", error);
    }
    useNotifcation.updateNotification("success", message);
  };

  return (
    <FormContainer>
      <div className={"max-w-screen-lg mx-auto"}>
        <form onSubmit={handleSubmit} className={commonModelClasses}>
          {/* adding this div so that those do things dont have space between them becuase of the space-y-6 */}
          <div>
            <Title content="Please enter the OTP to verify your account"></Title>
            <p className="text-center dark:text-dark-subtle text-light-subtle">
              OTP has been sent to your email
            </p>
          </div>

          <div className="flex justify-around">
            {
              // _ is a way of telling, that we are not going to use the contents of the otp array
              // otp.map((otpValue, index)=>{})
              otp.map((_, index) => {
                return (
                  <input
                    ref={activeOtpIndex === index ? inputRef : null}
                    key={index}
                    value={otp[index] || ""}
                    onChange={(e) => handleOTPChange(e, index)}
                    onKeyDown={(e) => handleOnKeyDown(e, index)}
                    className="w-12 h-12 border-2 rounded dark:border-dark-subtle border-light-subtle bg-transparent dark:focus:border-white focus:border-primary outline-none dark:text-white text-primary  text-center font-semibold text-xl"
                    type="number"
                  />
                );
              })
            }
          </div>

          <div className="flex flex-col">
            <Submit value="Verify Your Email" />
            {/* if we do not specify the type of button as button, then then form will treat this as the submit button too, and then we will get error because we are submitting without entering any OTP */}
            <button
              type="button"
              className="dark:text-white text-blue-300 hover:underline mt-2"
              onClick={handleOTPResend}
            >
              I do not have an OTP.
            </button>
          </div>
        </form>
      </div>
    </FormContainer>
  );
};

export default EmailVerification;
