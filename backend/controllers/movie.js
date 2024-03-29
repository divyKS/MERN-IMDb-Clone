const { isValidObjectId } = require("mongoose");
const Movie = require("../models/movie");
const Review = require("../models/review");
const cloudinary = require("cloudinary");
const { formatActor, averageRatingPipeline, relatedMovieAggregation, topRatedMoviesPipeline, getAverageRatings } = require("../utils/helper");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

exports.uploadTrailer = async (req, res) => {
  const videoFile = req.file;

  if (!videoFile)
    return res.status(401).json({ error: "video file is missing" });

  const { public_id, secure_url } = await cloudinary.v2.uploader.upload(
    videoFile.path,
    { resource_type: "video" },
  );

  res.status(201).json({ url: secure_url, public_id: public_id });
};

exports.createMovie = async (req, res) => {
  // const videoFile = req.file;
  const file = req.file;
  // poster is sent with 'poster' key but it can't be destructured here, because it will come though the req.file and not req.body
  const {
    title,
    storyLine,
    director,
    releaseDate,
    status,
    type,
    genres,
    tags,
    cast,
    writers,
    trailer,
    language,
  } = req.body;

  const newMovie = new Movie({
    title,
    storyLine,

    releaseDate,
    status,
    type,
    genres,
    tags,
    cast,

    trailer,
    language,
  });

  if (director) {
    console.log({director})
    if (!isValidObjectId(director)) return res.status(401).json({ error: "invalid director id" });
    newMovie.director = director;
  }
  
  if (writers) {
    let index = 0;
    for (let writerId of writers) {
      if (!isValidObjectId(writerId)) return res.status(401).json({ "error": "Invalid writer id at index=" + index + ". The invalid writer id=" + writerId });
      index++;
    }
    newMovie.writers = writers;
  }

  // if (!file) return res.status(401).json({ error: "poster is missing 1" }); but we want to keep the poster as an optional field

  if(file){
    // uploading poster + with mutiple dimensions so we can use smaller images on smaller devices
    // its response.responsive_breakpoints[0].breakpoints has objects of differnt size of the images
    const { secure_url, public_id, responsive_breakpoints } =
    await cloudinary.v2.uploader.upload(file.path, {
      transformation: {
        width: 1280,
        height: 720,
      },
      responsive_breakpoints: {
        create_derived: true,
        max_width: 640,
        max_images: 3,
      },
    });

    // the poster that we get from the frontend in req.file, only has a single image, we convert it into 1280x720 size and create 2 more copies of it in smaller sizes and then store that in our DB
    const finalPoster = { url: secure_url, public_id, responsive: [] };

    const { breakpoints } = responsive_breakpoints[0];

    if (breakpoints.length) {
      for (let imgObj of breakpoints) {
        const breakpointSecureURL = imgObj.secure_url;
        finalPoster.responsive.push(breakpointSecureURL);
      }
    }

    newMovie.poster = finalPoster;
  }

  await newMovie.save();

  res.status(201).json({
    "movie": {
      "id": newMovie._id,
      "title": title
    }
  });
};

exports.updateMovieWithoutPoster = async (req, res) => {
  const { movieId } = req.params;

  if (!isValidObjectId(movieId))
    return res.status(401).json({ error: "invalid movie id" });

  const movieToUpdate = await Movie.findById(movieId);

  if (!movieToUpdate) return res.status(404).json({ error: "movie not found" });

  const {
    title,
    storyLine,
    director,
    releaseDate,
    status,
    type,
    genres,
    tags,
    cast,
    writers,
    trailer,
    language,
  } = req.body;

  movieToUpdate.title = title;
  movieToUpdate.storyLine = storyLine;
  movieToUpdate.releaseDate = releaseDate;
  movieToUpdate.status = status;
  movieToUpdate.type = type;
  movieToUpdate.genres = genres;
  movieToUpdate.tags = tags;
  movieToUpdate.cast = cast;
  movieToUpdate.trailer = trailer;
  movieToUpdate.language = language;

  // director and writers were optional fields
  if (director) {
    if (!isValidObjectId(director))
      return res.status(401).json({ error: "invalid director id" });
    movieToUpdate.director = director;
  }

  if (writers) {
    let index = 0;
    for (let writerId of writers) {
      if (!isValidObjectId(writerId))
        return res
          .status(401)
          .json({ error: "invalid writer id at index ", index });
      index++;
    }
    movieToUpdate.writers = writers;
  }

  await movieToUpdate.save();

  res.json({ message: "movie has been successfully updated", movieToUpdate });
};

exports.updateMovieWithPoster = async (req, res) => {
  const { movieId } = req.params;
  
  if (!isValidObjectId(movieId)) return res.status(401).json({ error: "invalid movie id" });
  
  const file = req.file;

  // if (!file) return res.status(401).json({"error": "movie poster is missing hence can't use this route to update the movie"});

  const movieToUpdate = await Movie.findById(movieId);

  if (!movieToUpdate) return res.status(404).json({ error: "movie not found" });

  const {
    title,
    storyLine,
    director,
    releaseDate,
    status,
    type,
    genres,
    tags,
    cast,
    writers,
    trailer,
    language,
  } = req.body;

  movieToUpdate.title = title;
  movieToUpdate.storyLine = storyLine;
  movieToUpdate.releaseDate = releaseDate;
  movieToUpdate.status = status;
  movieToUpdate.type = type;
  movieToUpdate.genres = genres;
  movieToUpdate.tags = tags;
  movieToUpdate.cast = cast;
  // movieToUpdate.trailer = trailer;
  movieToUpdate.language = language;

  // director and writers were optional fields
  if (director) {
    if (!isValidObjectId(director)) return res.status(401).json({ "error": "invalid director id here?" });
    movieToUpdate.director = director;
  }

  if (writers) {
    let index = 0;
    for (let writerId of writers) {
      if (!isValidObjectId(writerId))
        return res.status(401).json({ "error": "invalid writer id at index ", index });
      index++;
    }
    movieToUpdate.writers = writers;
  }

  // poster would be optional to update so treating it like this 
  if(file){
    const currentPosterPublicId = movieToUpdate.poster?.public_id;

    // if old poster is present
    if (currentPosterPublicId) {
      const { result } = await cloudinary.v2.uploader.destroy(currentPosterPublicId);
      if (result !== "ok") return res.status(401).json({"error": "can't update poster as older poster could not be deleted, hence movie not updated"});
    }

    const { secure_url, public_id, responsive_breakpoints } =
      await cloudinary.v2.uploader.upload(file.path, {
        transformation: {
          width: 1280,
          height: 720,
        },
        responsive_breakpoints: {
          create_derived: true,
          max_width: 640,
          max_images: 3,
        },
      });

    const finalPoster = { url: secure_url, public_id, responsive: [] };

    const { breakpoints } = responsive_breakpoints[0];

    if (breakpoints.length) {
      for (let imgObj of breakpoints) {
        const breakpointSecureURL = imgObj.secure_url;
        finalPoster.responsive.push(breakpointSecureURL);
      }
    }

    movieToUpdate.poster = finalPoster;
  }

  await movieToUpdate.save();

  // res.json({ "message": "movie has been successfully updated", movieToUpdate }); we don't need to receive everything about the movie in the frontend, so we are sending only the things required
  res.json({ 
    "message": "movie has been successfully updated",
    "movie": {
      "id": movieToUpdate._id,
      "poster": movieToUpdate.poster?.url,
      "title": movieToUpdate.title,
      "genres": movieToUpdate.genres,
      "status": movieToUpdate.status
    }
  }); 

};

exports.removeMovie = async (req, res) => {
  const { movieId } = req.params;

  if (!isValidObjectId(movieId))
    return res.status(401).json({ error: "invalid movie id" });

  const movieToDelete = await Movie.findById(movieId);

  if (!movieToDelete)
    return res.status(404).json({ error: "movie not found to delete" });

  const posterId = movieToDelete.poster?.public_id;

  if (posterId) {
    const { result } = await cloudinary.v2.uploader.destroy(posterId);
    if (result !== "ok")
      return res
        .status(401)
        .json({
          error:
            "could not remove poster from cloudinary, hence movie will not be deleted from mongodb",
        });
  }

  const trailerId = movieToDelete.trailer?.public_id;

  if (!trailerId)
    return res
      .status(401)
      .json({
        error: "could not find trailer, hence not deleting movie completely",
      });

  if (trailerId) {
    const { result } = await cloudinary.v2.uploader.destroy(trailerId, {
      resource_type: "video",
    });
    if (result !== "ok")
      return res
        .status(401)
        .json({
          error:
            "could not remove trailer from cloudinary, hence movie will not be deleted from mongodb",
        });
  }

  await Movie.findByIdAndDelete(movieId);

  res.json({ message: "movie deleted successfully" });
};

exports.getMovies = async (req, res) => {
  const {pageNo = 0, limit = 5} = req.query;

  const moviesForThisPage = await Movie.find({}).sort({createdAt: -1}).skip(parseInt(pageNo)*parseInt(limit)).limit(parseInt(limit));

  const formattedMovies = moviesForThisPage.map((movie) => {
    return ({
        "id": movie._id,
        "title": movie.title,
        "poster": movie.poster?.url,
        "responsivePosters": movie.poster?.responsive,
        "genres": movie.genres,
        "status": movie.status
      })
  });
  res.json({"movies": formattedMovies});
};

exports.getMovieForUpdate = async (req, res) => {
  const {movieId} = req.params;

  if(!isValidObjectId(movieId)) return res.status(401).json({'error': 'movie id for updating movie is not valid id'});

  const movie = await Movie.findById(movieId).populate('director writers cast.actor');

  res.json({ 
    "movie": {
      "id": movie._id,
      "title": movie.title,
      "storyLine": movie.storyLine,
      "poster": movie.poster?.url,
      "releaseDate": movie.releaseDate,
      "status": movie.status,
      "type": movie.type,
      "language": movie.language,
      "genres": movie.genres,
      "tags": movie.tags,
      "director": formatActor(movie.director),
      "writers": movie.writers.map(w=>formatActor(w)),
      "cast": movie.cast.map(c=>{
        return {
          "id": c._id,
          "profile": formatActor(c.actor),
          "roleAs": c.roleAs,
          "leadActor": c.leadActor
        }
      })
    } 
  });
};

exports.searchMovies = async (req, res) => {
  const {title} = req.query;
  if(!title.trim()) return res.json({'error': 'cant search for an empty movie'});
  const movies = await Movie.find({title: {$regex: title, $options: 'i'}});
  res.json({results: movies.map(m => {
    return {
      "id":m._id,
      "title":m.title,
      "poster":m.poster?.url,
      "genres":m.genres,
      "status":m.status
    }
  })})
};

// FOR USERS ->

exports.getLatestUploads = async (req, res) => {
  const result = await Movie.find({status: 'public'}).sort('-createdAt').limit(5);
  const formattedMovieData = result.map((m) => {
    return {
      "id": m._id,
      "title": m.title,
      "storyLine": m.storyLine,
      "poster": m.poster?.url,
      "responsivePosters": m.poster.responsive,
      "trailer": m.trailer?.url
    }
  });
  res.json({'movies': formattedMovieData});
};

exports.getSingleMovie = async (req, res) => {
  const { movieId } = req.params;

  if(!isValidObjectId(movieId)) return res.status(401).json({'error': 'movie is not valid id, cant fetch for normal user'});

  const movie = await Movie.findById(movieId).populate('director writers cast.actor');

  const [aggregatedResponse] = await Review.aggregate(averageRatingPipeline(movie._id)); // we can't send the movieId, we'll have to do mongoose.Types.ObjectId(movieId)

  const reviews = {};

  if(aggregatedResponse){
    const { ratingAverage, reviewCount } = aggregatedResponse;
    reviews.ratingAverage = parseFloat(ratingAverage).toFixed(1); //we want X.Y form only
    reviews.reviewCount = reviewCount;
  } 

  const { _id: id, title, storyLine, cast, writers, director, releaseDate, genres, tags, language, poster, trailer, type } = movie;

  res.json({
    movie: {
      id,
      title,
      storyLine,
      releaseDate,
      genres,
      tags,
      language,
      type,
      poster: poster?.url,
      trailer: trailer?.url,
      cast: cast.map((c) => ({
        id: c._id,
        profile: {
          id: c.actor._id,
          name: c.actor.name,
          avatar: c.actor?.avatar?.url,
        },
        leadActor: c.leadActor,
        roleAs: c.roleAs,
      })),
      writers: writers.map((w) => ({
        id: w._id, //so that clicking on writers we can get to know more about them
        name: w.name,
      })),
      director: {
        id: director._id,
        name: director.name,
      },
      reviews: {...reviews}
    },
  });
};

exports.getRelatedMovies = async (req, res) => {
  const { movieId } = req.params;
  if(!isValidObjectId(movieId)) return res.status(401).json({'error': 'movie id invalid, cant get the related movies by tag'});
  
  const movie = await Movie.findById(movieId);

  let relatedMovies = await Movie.aggregate(relatedMovieAggregation(movie.tags, movie._id));

  const getTheReview = async (movieId) => {
    const [aggregatedResponse] = await Review.aggregate(averageRatingPipeline(movieId)); // we can't send the movieId, we'll have to do mongoose.Types.ObjectId(movieId)
    const reviews = {};  
    if(aggregatedResponse){
      const { ratingAverage, reviewCount } = aggregatedResponse;
      reviews.ratingAverage = parseFloat(ratingAverage).toFixed(1); //we want X.Y form only
      reviews.reviewCount = reviewCount;
    } 
    return reviews;
  }

  // with this we would get empty objects, since there is async await inside map
  // relatedMovies = relatedMovies.map(async(m) => {
  //   const reviews = await getTheReview(m._id);
  //   return {
  //     id: m._id,
  //     title: m.title,
  //     poster: m.poster,
  //     reviews: {...reviews}
  //   }
  // }) 

  relatedMovies = await Promise.all(relatedMovies.map(async(m) => {
    const reviews = await getTheReview(m._id);
    return {
      id: m._id,
      title: m.title,
      poster: m.poster,
      responsivePosters: m.responsivePosters,
      reviews: {...reviews}
    }
  }));

  res.json({relatedMovies}); // !has to be sent back as object otherwise won't work

};

exports.getTopRatedMovies = async (req, res) => {
  const {type='Film'} = req.query;
  const movies = await Movie.aggregate(topRatedMoviesPipeline(type));
  
  const getTheReview = async (movieId) => {
    const [aggregatedResponse] = await Review.aggregate(averageRatingPipeline(movieId)); // we can't send the movieId, we'll have to do mongoose.Types.ObjectId(movieId)
    const reviews = {};  
    if(aggregatedResponse){
      const { ratingAverage, reviewCount } = aggregatedResponse;
      reviews.ratingAverage = parseFloat(ratingAverage).toFixed(1); //we want X.Y form only
      reviews.reviewCount = reviewCount;
    } 
    return reviews;
  }

  const topRatedMovies = await Promise.all(movies.map(async(m)=>{
    const reviews = await getTheReview(m._id);
    return {
      id: m._id,
      title: m.title,
      poster: m.poster,
      responsivePosters: m.responsivePosters,
      reviews: {...reviews}
    }
  }));

  res.json({"movies": topRatedMovies});
};

exports.searchPublicMovies = async (req, res) => {
  const {title} = req.query;

  if(!title.trim()) return res.json({'error': 'cant search for an empty movie'});

  const movies = await Movie.find({title: {$regex: title, $options: 'i'}, status: 'public'});

 const requiredFormatMovies = await Promise.all(movies.map(async(m)=>{
    const reviews = await getAverageRatings(m._id);
    return {
      id: m._id,
      title: m.title,
      poster: m.poster?.url,
      responsivePosters: m.poster?.responsive,
      reviews: {...reviews}
    }
  }));

  res.json({"results": requiredFormatMovies});
};