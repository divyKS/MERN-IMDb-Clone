const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.isAuth = async (req, res, next)=>{
    const token = req.headers.authorization;
    const jwtToken = token.split('Bearer ')[1];
    if(!jwtToken){
        return res.status(401).json({"error": "Invalid Token"});
    }
    const jwtResponse = jwt.verify(jwtToken, process.env.JWT_SECRET);
    const userId = jwtResponse.userId;
    const user = await User.findById(userId)
    if(!user){
        return res.status(404).json({"error": "User not found but some how the token was valid"});
    }
    req.user = user;
    // not sending the response like this now, adding the user to the request, and letting this to be handeled by the handler
    // res.json({
    //     "user": {
    //         "id": user._id,
    //         "name": user.name,
    //         "email": user.email
    //     }
    // });
    next();
};