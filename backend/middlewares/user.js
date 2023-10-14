const { isValidObjectId } = require("mongoose");
const PasswordResetToken = require("../models/passwordResetToken");

exports.isValidPassResetToken = async (req, res, next) => {
  const { token, userId } = req.body;

  if (!token.trim() || !isValidObjectId(userId)) {
    return res.status(401).json({ error: "invalid request" });
  }

  const resetTokenUser = await PasswordResetToken.findOne({ owner: userId });
  if (!resetTokenUser) {
    return res
      .status(401)
      .json({ error: "unauthorized request, invalid request!" });
  }

  // now checking is the token that we recieved and the token that is present in hashed format in our DB for the user with given userId
  const matched = await resetTokenUser.compareToken(token);
  if (!matched) {
    return res
      .status(401)
      .json({ error: "unauthorized request, invalid request!" });
  }
  // adding a new field resetTokenUser to the req so that we can use that in the actual handler
  req.resetTokenUser = resetTokenUser;
  next();
};
