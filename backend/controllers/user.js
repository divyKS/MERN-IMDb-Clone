const User = require("../models/user");
const EmailVerificationToken = require("../models/emailVerificationToken");
const { isValidObjectId } = require("mongoose");
const { generateOTP, generateMailTransporter } = require("../utils/mail");
const PasswordResetToken = require("../models/passwordResetToken");
const { generateRandomBytes } = require("../utils/helper");
const jwt = require("jsonwebtoken");

//this function gets the req.body access only after ensuring that the name, email, and password fields have data and password is of correct length by our validators (userValidator)
exports.create = async (req, res) => {
  const { name, email, password } = req.body;

  const userWithSameEmailExists = await User.findOne({ email }); // this either returns the whole object with that email or null

  if (userWithSameEmailExists) {
    return res.status(401).json({ error: "This email id is already taken." });
  }

  const newUser = new User({ name: name, email: email, password: password });
  await newUser.save();

  const OTP = generateOTP();
  // console.log(OTP)
  const newEmailVerificationToken = new EmailVerificationToken({
    owner: newUser._id,
    token: OTP,
  });
  await newEmailVerificationToken.save(); // like we get a save() method on our schema/model we can add our own methods too, we can add those in the models

  var transport = generateMailTransporter();

  transport.sendMail({
    from: "verification@reviewapp.com",
    to: newUser.email,
    subject: "Email Verification",
    html: `
            <p>Your email verification OTP.</p>
            <h4>${OTP}</h4>
        `,
  });

  // res.status(201).json({"message": "Please verify your email. Check your inbox for the OTP."});

  // this reponse, becase when we will use the vevrifyEmail to verify the OTP thing, we need the userId and OTP
  res.status(201).json({
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    },
  });
};

exports.verifyEmail = async (req, res) => {
  // userId is the _id of the mongodb
  const { userId, OTP } = req.body;
  console.log(userId, isValidObjectId(userId));
  if (!isValidObjectId(userId)) {
    return res.json({ error: "Invalid user hence can't be verified" });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res
      .status(404)
      .json({
        error: "user does not exist but the id does, hence can't be verified",
      });
  }

  if (user.isVerified) {
    return res.json({ error: "user is already verified" });
  }

  const token = await EmailVerificationToken.findOne({ owner: userId }); // this shouldn't directly give the token, token.token should be the token, will it not be returning the whole object with that userId from the emailVeritifactionTOkenSchema. Yes we end up doing that only, this.token meant token.token
  if (!token) {
    return res.json({ error: "token not found" });
  }

  const tokenMatchesTheHashedToken = await token.compareToken(OTP);
  if (!tokenMatchesTheHashedToken) {
    return res.json({ error: "OTP Invalid. Re-enter the otp." });
  }

  user.isVerified = true;
  await user.save(); // to apply the state change to true

  // delete the hashed OTP complete entry
  console.log(
    "I have reached here to delete the token from email verification token",
  );
  await EmailVerificationToken.findByIdAndDelete(token._id);

  var transport = generateMailTransporter();

  transport.sendMail({
    from: "verification@reviewapp.com",
    to: user.email,
    subject: "Welcome",
    html: `
            <p>Your email verification is complete. Welcome to our movie review app.</p>
        `,
  });

  // for a good user experience, if the user verifies the email by entering the correct OTP, we should log him inside the app automatically, we shouldn't redirect him to the signin page and again askk for the email and password
  const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      token: jwtToken,
      isVerified: user.isVerified,
      role: user.role,
    },
    message: "Your email has been verified.",
  });

  // this will be sent to our frontend, was sending this only beofre the above addition for a better user experience
  // res.json({"message": "Your email has been verified."})
};

exports.resendEmailVerificationToken = async (req, res) => {
  // the user would already be logged into our app, might not be able to access some features that are available for verified users only
  const { userId } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return res.json({ error: "User not found" });
  }

  if (user.isVerified) {
    return res.json({
      error:
        "This email is already verified, no need to try to re verify this email",
    });
  }

  // if a token is already present in our database, then we do not have to regenerate the token for the same userId
  // and if same userId has multiple tokens then with which token do we verify?
  const alreadyHasToken = await EmailVerificationToken.findOne({
    owner: userId,
  });

  if (alreadyHasToken) {
    return res.json({
      error:
        "One OTP has already been sent to you. Wait one another to request for another OTP",
    });
  }

  const OTP = generateOTP();

  const newEmailVerificationToken = new EmailVerificationToken({
    owner: user._id,
    token: OTP,
  });
  await newEmailVerificationToken.save(); // like we get a save() method on our schema/model we can add our own methods too, we can add those in the models

  var transport = generateMailTransporter();

  transport.sendMail({
    from: "verification@reviewapp.com",
    to: user.email,
    subject: "Email Verification",
    html: `
            <p>Your email verification OTP.</p>
            <h4>${OTP}</h4>
        `,
  });

  res
    .status(201)
    .json({
      message: "Please verify your email. Check your inbox for the new OTP.",
    });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(401).json({ error: "email is missing" });
  }

  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(404).json({ error: "user with given email not found" });
  }
  // if(user.isVerified){
  //     return res.status(401).json({"error": "This email is already verified. No need to verify again."})
  // }
  // checking if already a reset token has been generated for this user
  const alreadyHasPasswordResetToken = await PasswordResetToken.findOne({
    owner: user._id,
  });
  if (alreadyHasPasswordResetToken) {
    return res
      .status(401)
      .json({
        error: "Wait an hour to regenerate another password reset token",
      });
  }

  // now we have done all the checks, and we are sure that we have to let the user reset his password
  // just using the 6/8/n digit OTP isn't strong enough, so we will use crypto module from npm for the same

  // crypto.randomBytes(30, (error, buffer)=>{
  //     if(error) return console.log(error);
  //     const secureKey = buffer.toString('hex');
  // });

  //that is okay but we want to use async await, so we are putting that into util/helper

  // missed an await here, and app crashed
  const tokenToResetPassword = await generateRandomBytes();
  const newPasswordResetToken = await new PasswordResetToken({
    owner: user._id,
    token: tokenToResetPassword,
  });
  await newPasswordResetToken.save();

  // this will for our react part
  const resetPasswordURL = `http://localhost:5173/auth/reset-password?token=${tokenToResetPassword}&id=${user._id}`;
  var transport = generateMailTransporter();
  transport.sendMail({
    from: "security@reviewapp.com",
    to: user.email,
    subject: "Reset Password Link",
    html: `
            <p>
                <a href='${resetPasswordURL}'>Click here</a> to reset passsword
            </p>
        `,
  });
  res.json({
    message: "Link to reset your password has been sent to your email",
  });
};

exports.sendResetPasswordTokenStatus = (req, res) => {
  res.json({ valid: true });
};

exports.resetPassword = async (req, res) => {
  // const {newPassword} = req.body; we shouldn't be able to have newPassword as the field, since we are using the validators, and they have the field as password, so for those to work we will have to have the things as password?
  // we have done the password validation in middlewares
  const { password, userId } = req.body;
  const newPassword = password;
  console.log("password from the req.body i.e. the new password = " + password);
  const userWhosePasswordHasToBeUpdated = await User.findById(userId);
  console.log(
    "User for which we are resetting the password = " +
      userWhosePasswordHasToBeUpdated,
  );
  // to check if the new passowrd is not same as the old password, we can create compare function inside model of user
  // missed await here again
  const passwordIsSame =
    await userWhosePasswordHasToBeUpdated.comparePassword(newPassword);
  console.log(passwordIsSame);
  if (passwordIsSame) {
    return res
      .status(401)
      .json({ error: "new password should be different from the old one" });
  }
  userWhosePasswordHasToBeUpdated.password = newPassword;
  await userWhosePasswordHasToBeUpdated.save(); // this will hash and save

  await PasswordResetToken.findByIdAndDelete(req.resetTokenUser._id);

  var transport = generateMailTransporter();
  transport.sendMail({
    from: "security@reviewapp.com",
    to: userWhosePasswordHasToBeUpdated.email,
    subject: "Password Reset Successful",
    html: `
            <p>Your password has been reset successfully. You can now go back and use our website with the new password.</p>
        `,
  });

  res.json({ message: "Password Reset Successful" });
};

exports.signIn = async (req, res) => {
  const { email, password } = req.body;
  // the validation of these will be dont by middlewares, like in the case of reset passoword
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.json({ error: "user with this email does not exist" });
  }
  const passwordMatched = await user.comparePassword(password);
  if (!passwordMatched) {
    return res.json({ error: "password is incorrect" });
  }

  // jwt payloads, that is the first option is available so do not pass any sensitive information into that, hence holding off passowrd into it
  // we are signing the jwt only after ensuring the user had also given the correct passowrd, hence afterwards if we just have the user._id we knows it exists only because once the user had entered the username with the correct passord, so we dont have to check that agin and again just the prescence of userId is suffcient

  const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.json({
    user: {
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: jwtToken,
      isVerified: user.isVerified,
      role: user.role,
    },
  });
};
