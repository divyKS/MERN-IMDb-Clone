const { isValidObjectId } = require("mongoose");
const Movie = require('../models/movie');
const Review = require('../models/review');
const { getAverageRatings } = require("../utils/helper");

exports.addReview = async (req, res) => {
    const { movieId } = req.params;
    const { content, rating } = req.body;
    const userId = req.user._id; // gets added into req from the isAuth

    if(!isValidObjectId(movieId)) return res.status(401).json({'error': 'invalid movie id for the movie re'});

    const movie = await Movie.findOne({_id:movieId, status: 'public'}) // users can add reviews to the public id only

    if(!movie) return res.status(404).json({'error': 'movie with the given id which is public not found'});

    const reviewAlreadyExists = await Review.findOne({owner: userId, parentMovie: movie._id});

    if(reviewAlreadyExists) return res.status(401).json({'error': 'you have already reviewed this movie, you cant add another review, you can edit your previous review'});

    const newReview = new Review({
        owner: userId,
        parentMovie: movie._id,
        content,
        rating
    });

    movie.reviews.push(newReview._id);

    await newReview.save();
    await movie.save();

    const reviews = await getAverageRatings(movie._id); // has to be done after saving the reviews otherwise there will be none

    res.json({'message': 'review added in the review and the movie', reviews});
};

exports.updateReview = async (req, res) => {
    const { reviewId } = req.params;
    const { content, rating } = req.body;
    const userId = req.user._id; // gets added into req from the isAuth

    if(!isValidObjectId(reviewId)) return res.status(401).json({'error': 'invalid review id'});

    const oldReview = await Review.findOne({owner: userId, _id:reviewId}); // the review should belong to the user trying to update the review

    if(!oldReview) return res.status(404).json({'error': 'review not found'});

    if(content && content.trim()) oldReview.content = content;
    if(rating) oldReview.rating = rating;
    
    await oldReview.save();

    res.json({'message': 'your review has been updated'});
};

exports.deleteReview = async (req, res) => {
    const { reviewId } = req.params;
    const userId = req.user._id; // gets added into req from the isAuth

    if(!isValidObjectId(reviewId)) return res.status(401).json({'error': 'invalid review id, so cant delete'});

    const reviewToDel = await Review.findOne({owner: userId, _id:reviewId });

    if(!reviewToDel) return res.status(404).json({'error': 'this user does not own this review, review not found'});

    const movieWhichHasThisReview = await Movie.findById(reviewToDel.parentMovie);
    const allReviews = movieWhichHasThisReview.reviews;

    const updatedReviews = allReviews.filter(rId => rId.toString() !== reviewId); // ! to compare two object id we have to convert them into string

    movieWhichHasThisReview.reviews = updatedReviews;

    await movieWhichHasThisReview.save();
    await Review.findByIdAndDelete(reviewId);

    res.json({'message': 'review has been removed successfully'});
};

exports.getReviewsByMovie = async (req, res) => {
    const { movieId } = req.params;

    if(!isValidObjectId(movieId)) return res.status(401).json({'error': 'invalid movie id, so cant get reviews for this'});

    const movie = await Movie.findById(movieId)
		.populate({
			path: 'reviews',
			populate: { path: 'owner', select: 'name' },
		})
		.select('reviews title');//title so that we can render the name of the movie in the review section when we fetch for the reviews with the movie id 

    const requiredReviews = movie.reviews.map(r => {
        const {owner, content, rating, _id: reviewId} = r;
        const {name, _id: ownerId} = owner;
        return {
            id: reviewId,
            owner: {
                id: ownerId,
                name
            },
            content,
            rating
        }
    })
    res.json({
        "movie": {
            "title": movie.title,
            "reviews": requiredReviews
        }
    });    
};