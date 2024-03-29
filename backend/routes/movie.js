const express = require("express");
const router = express.Router();

const { isAuth, isAdminAuth } = require("../middlewares/auth");
const { uploadVideo, uploadImage } = require("../middlewares/multer");
const { uploadTrailer, createMovie, updateMovieWithoutPoster, updateMovieWithPoster, removeMovie, getMovies, getMovieForUpdate, searchMovies, getLatestUploads, getSingleMovie, getRelatedMovies, getTopRatedMovies, searchPublicMovies, } = require("../controllers/movie");
const { parseData } = require("../utils/helper");
const { validateMovie, validate, validateTrailer } = require("../middlewares/validators");

// ! If multer is not used in some route i.e. if uploadImage.single('poster') etc. isn't used
// ! then sending data from postman as "from data" will not work - unexpected token in JSON at position
// ! hence send data as raw JSON only
// ! but still it won't work and you will have to remove the parseData middleware to make it work
// ALL THIS FOR POSTMAN ONLY. When we will use frontend to send these requests, it will be fine

router.post("/upload-trailer", isAuth, isAdminAuth, uploadVideo.single("video"), uploadTrailer,);

// parseData has to be after multer otherwise our req.body won't have anything
router.post("/create", isAuth, isAdminAuth, uploadImage.single("poster"), parseData, validateMovie, validateTrailer, validate, createMovie,);

router.patch("/update-movie-without-poster/:movieId", isAuth, isAdminAuth, parseData, validateMovie, validate, updateMovieWithoutPoster,);

router.patch("/update-movie-with-poster/:movieId", isAuth, isAdminAuth, uploadImage.single("poster"), parseData, validateMovie, validate, updateMovieWithPoster,);

router.delete("/delete/:movieId", isAuth, isAdminAuth, removeMovie);

router.get('/movies', isAuth, isAdminAuth, getMovies);

router.get('/for-update/:movieId', isAuth, isAdminAuth, getMovieForUpdate);

router.get('/search', isAuth, isAdminAuth, searchMovies);

// ROUTES FOR USERS ->

router.get('/latest-uploads', getLatestUploads);

router.get('/single/:movieId', getSingleMovie);

router.get('/related/:movieId', getRelatedMovies);

router.get('/top-rated', getTopRatedMovies);

router.get('/search-public', searchPublicMovies);


module.exports = router;
