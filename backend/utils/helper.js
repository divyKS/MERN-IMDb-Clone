const crypto = require("crypto");

// exports.sendError = (res, error, statusCode = 401) => (
//     res.status(statusCode).json({ error })
// )

exports.generateRandomBytes = () => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(30, (error, buffer) => {
      if (error) reject(error);
      // buffString is out required secured key
      const buffString = buffer.toString("hex");
      resolve(buffString);
    });
  });
};

exports.formatActor = (actor) => {
  return {
    id: actor._id,
    name: actor.name,
    about: actor.about,
    gender: actor.gender,
    avatar: {
      url: actor.avatar?.url,
      public_id: actor.avatar?.public_id,
    },
  };
};

exports.parseData = (req, res, next) => {
  const { trailer, cast, genres, tags, writer } = req.body;

  if (trailer) req.body.trailer = JSON.parse(trailer);
  if (cast) req.body.cast = JSON.parse(cast);
  if (genres) req.body.genres = JSON.parse(genres);
  if (tags) req.body.tags = JSON.parse(tags);
  if (writer) req.body.writer = JSON.parse(writer);

  next();
};
