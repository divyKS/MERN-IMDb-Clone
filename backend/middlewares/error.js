exports.errorHandler = (err, req, res, next) => {
  console.log("ASYNC ERROR: ", err);
  res.status(500).json({ Error: err.message || err });
};
