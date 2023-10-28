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
  const { trailer, cast, genres, tags, writers } = req.body;

  if (trailer) req.body.trailer = JSON.parse(trailer);
  if (cast) req.body.cast = JSON.parse(cast);
  if (genres) req.body.genres = JSON.parse(genres);
  if (tags) req.body.tags = JSON.parse(tags);
  if (writers) req.body.writers = JSON.parse(writers);

  next();
};

exports.averageRatingPipeline = (movieId) => {
  return (
    [
      {
        $lookup: {
          from: 'Review',
          localField: 'rating',
          foreignField: '_id',
          as: 'Average Rating'
        }
      },
      {
        $match: {
          parentMovie: movieId
        }
      },
      {
        $group: {
          _id: null,
          ratingAverage: {
            $avg: '$rating'
          },
          reviewCount: {
            $sum: 1
          }
        }
      }
    ]
  );
};

exports.relatedMovieAggregation = (tags, movieId) => {
  return [
    {
      $lookup: {
        from: "Movie",
        localField: "tags",
        foreignField: "_id",
        as: "relatedMovies",
      },
    },
    {
      $match: {
        tags: { $in: [...tags] },
        _id: { $ne: movieId },
      },
    },
    {
      $project: {
        title: 1,
        poster: "$poster.url",        
        responsivePosters: "$poster.responsive",
      },
    },
    {
      $limit: 5,
    },
  ];
};

exports.topRatedMoviesPipeline = (type) => {
  return (
    [
      {
        $lookup: {
          from: 'Movie',
          localField: 'reviews',
          foreignField: '_id',
          as: 'topRated'
        }
      },
      {
        $match: {
          reviews: {$exists: true},
          status: {$eq: 'public'},
          type: {$eq: type}
        }
      },
      {
        $project: {
          title: 1,
          poster: '$poster.url',
          responsivePosters: `$poster.responsive`,
          reviewCount: {$size: '$reviews'}
        }
      },
      {
        $sort: {
          reviewCount: -1
        }
      },
      {
        $limit: 5
      }
    ]
  );
};

exports.getAverageRatings = async (movieId) => {
  const [aggregatedResponse] = await Review.aggregate(
    this.averageRatingPipeline(movieId)
  );
  const reviews = {};

  if (aggregatedResponse) {
    const { ratingAvg, reviewCount } = aggregatedResponse;
    reviews.ratingAvg = parseFloat(ratingAvg).toFixed(1);
    reviews.reviewCount = reviewCount;
  }

  return reviews;
};

