// check is function that e-v provides
const {check, validationResult} = require('express-validator');

// name, email, password are the fields that we send in our request from postman/frontend to the backend to create the user
exports.userValidator = [
    check('name').trim().not().isEmpty().withMessage("Name is missing!"),
    check('email').normalizeEmail().isEmail().withMessage("Email is invalid!"),
    check('password').trim().not().isEmpty().withMessage("Password is missing").isLength({min:4, max:10}).withMessage("Password length needs to be in [4,10]")
];


exports.passwordValidator = [
    check('password').trim().not().isEmpty().withMessage("Password is missing").isLength({min:4, max:10}).withMessage("Password length needs to be in [4,10]")
];


// if any validation errors occur in above code then this middleware takes care of it
exports.validate = (req, res, next) => {
    const error = validationResult(req).array();
    // error would have all things checked at once and all errors in the array, but we are just printing one error at a time, and letting user fix that one field
    if(error.length){
        return res.json({"error": error[0].msg});
    }
    // console.log(error);
    next();
}

exports.signInValidator = [
    check('email').normalizeEmail().isEmail().withMessage("Email is invalid!"),
    check('password').trim().not().isEmpty().withMessage("Password is missing")
];