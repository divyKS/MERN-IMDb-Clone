const express = require('express');
const {create, verifyEmail, resendEmailVerificationToken, forgotPassword, sendResetPasswordTokenStatus, resetPassword, signIn} = require('../controllers/user');
const router = express.Router();
const {userValidator, validate, passwordValidator, signInValidator} = require('../middlewares/validators');
const {isValidPassResetToken} = require('../middlewares/user');
const { isAuth } = require('../middlewares/auth');

router.post('/create', userValidator, validate, create);
router.post('/verify-email', verifyEmail);
router.post('/resend-email-verification-token', resendEmailVerificationToken);
router.post('/forgot-password', forgotPassword);
// below is a middle ware, this route is being used so that when the user clicks on the link in his email to reset the password, we can ensure that he reset his password within an hour, and only then should he be allowed to reset his passowrd, more like a user experience thing, otherwisie he would write his new password, but then we would say that your token didn't match so we are not resetting it, to avoid this and letting user know upfront without entering new pass that he should get another link
router.post('/verify-reset-pass-token', isValidPassResetToken, sendResetPasswordTokenStatus);
// below route actually resets the password
// passwordValidator to check for the pass, valiate for the error message
router.post('/reset-password', isValidPassResetToken, passwordValidator, validate, resetPassword);
router.post('/signin', signInValidator, validate, signIn);

router.get('/is-auth', isAuth, (req, res)=>{
    const {user} = req;
    res.json({
        "user": {
            "id": user._id,
            "name": user.name,
            "email": user.email,
            "isVerified": user.isVerified
        }
    });
});

module.exports = router;