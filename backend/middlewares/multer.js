const multer = require("multer");
const storage = multer.diskStorage({});

// we get three arguments inside this function
const imageFileFilter = (req, file, callback) => {
  console.log("backend/middlewares/multer/imageFileFilter: ", file);
  if (!file.mimetype.startsWith("image")) {
    callback("Only image files can be uploaded", false);
  }
  callback(null, true);
};

const videoFileFilter = (req, file, callback) => {
  console.log("...Video File Filter...");
  console.log("backend/middlewares/multer/videoFileFilter: ", file);
  if (!file.mimetype.startsWith("video")) {
    callback("Only video files can be uploaded", false);
  }
  callback(null, true);
};

exports.uploadImage = multer({ storage, imageFileFilter });
exports.uploadVideo = multer({ storage, videoFileFilter });
