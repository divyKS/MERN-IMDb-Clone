const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.isAuth = async (req, res, next)=>{

    const token = req.headers.authorization;

    if(!token) return res.status(401).json({"error": "There is no token in the authorization section, we can't check if the user is logged in or not."});

    const jwtToken = token.split('Bearer ')[1];

    if(!jwtToken) return res.status(401).json({"error": "There is no token after the Bearer ..."});

    const jwtResponse = jwt.verify(jwtToken, process.env.JWT_SECRET);

    const userId = jwtResponse.userId;

    const user = await User.findById(userId);

    if(!user) return res.status(404).json({"error": "User not found but some how the token was valid"});

    req.user = user; // now all the following middlewares/controllers will have access the 'user' inside the req object

    next();
};

exports.isAdminAuth = async (req, res, next)=>{
    // we would have first used the isAuth middleware to check if the user is logged in. If he is, then the 'req' object would have the 'user' now
    const {user} = req;

    if(user.role !== 'admin') return res.status(401).json({"error": "You are not an admin, you can't use this route"});

    next();
}