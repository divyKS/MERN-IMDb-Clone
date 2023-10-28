const Movie = require('../models/movie');
const Review = require('../models/review');
const User = require('../models/user');
const { averageRatingPipeline, relatedMovieAggregation, topRatedMoviesPipeline } = require("../utils/helper");

exports.getAppInfo = async (req, res) => {
    const totalUploads = await Movie.countDocuments();
    const totalReviews = await Review.countDocuments();
    const totalUsers = await User.countDocuments();

    res.json({
        "appInfo": {
            "movieCount": totalUploads,
            "reviewCount": totalReviews,
            "userCount": totalUsers
        }
    });
};

exports.getMostRated = async (req, res) => {
    const movies = await Movie.aggregate(topRatedMoviesPipeline());
    
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
        reviews: {...reviews}
      }
    }));
  
    res.json({"movies": topRatedMovies});
};