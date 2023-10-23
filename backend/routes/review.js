const router = require('express').Router();

const { addReview, updateReview, deleteReview, getReviewsByMovie } = require('../controllers/review');
const { isAuth } = require('../middlewares/auth');
const { validateRatings, validate } = require('../middlewares/validators');

router.post('/add/:movieId', isAuth, validateRatings, validate, addReview);

router.patch('/:reviewId', isAuth, updateReview);

router.delete('/:reviewId', isAuth, deleteReview);

router.get('/get-reviews-by-movie/:movieId', getReviewsByMovie);

module.exports = router;