const { isValidObjectId } = require("mongoose");
const Actor = require("../models/actor");
const cloudinary = require("cloudinary");
const { formatActor } = require("../utils/helper");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

exports.createActor = async (req, res) => {
  // the image file is in req.file, the reamining fields we get in req.body
  // console.log(req.file, req.body);
  const { name, about, gender } = req.body;
  const imageFile = req.file;

  // imageFile is stored in Cloudinary, in mongodb we store it's reference under avatar key
  const newActor = await new Actor({ name, about, gender });

  if (imageFile) {
    const { secure_url, public_id } = await cloudinary.v2.uploader.upload(
      imageFile.path,
      { gravity: "face", height: 500, width: 500, crop: "thumb" },
    );
    newActor.avatar = { "url": secure_url, "public_id": public_id };
  }

  await newActor.save();

  // adding the actor so that we can destructure the error and actor in the frontend
  res.status(201).json({
		"actor": {
			"id": newActor._id,
			"name": name,
			"about": about,
			"gender": gender,
			"avatar": {
				"url": newActor.avatar?.url,
				"public_id": newActor.avatar?.public_id
			}
		}
  });
};

exports.updateActor = async (req, res) => {
  const updatedName = req.body.name;
  const updatedAbout = req.body.about;
  const updatedGender = req.body.gender;
  const updatedImageFile = req.file;
  const { actorId } = req.params;

  if (!isValidObjectId(actorId))
    return res.status(401)
      .json({
        error:
          "The id present in the url params is not a valid object id or it might be undefined/null",
      });

  const actorToBeUpdated = await Actor.findById(actorId);

  if (!actorToBeUpdated)
    return res
      .status(401)
      .json({
        error:
          "There is no actor is the database corresponding to the id in the url parameters",
      });

  const public_id = actorToBeUpdated.avatar?.public_id;

  if (public_id && updatedImageFile) {
    const { result } = await cloudinary.v2.uploader.destroy(public_id);
    if (result !== "ok")
      return res
        .status(401)
        .json({
          error:
            "Could not delete the image from cloudinary with id " +
            public_id +
            " for updation purpose.",
        });
  }

  if (updatedImageFile) {
    const { secure_url, public_id } = await cloudinary.v2.uploader.upload(
      updatedImageFile.path,
      { gravity: "face", height: 500, width: 500, crop: "thumb" },
    );
    actorToBeUpdated.avatar = { url: secure_url, public_id: public_id };
  }

  actorToBeUpdated.name = updatedName;
  actorToBeUpdated.about = updatedAbout;
  actorToBeUpdated.gender = updatedGender;

  await actorToBeUpdated.save();

  res.status(201).json({
		"actor": {
			"id": actorToBeUpdated._id,
			"name": updatedName,
			"about": updatedAbout,
			"gender": updatedGender,
			"avatar": {
				"url": actorToBeUpdated.avatar?.url,
				"public_id": actorToBeUpdated.avatar?.public_id,
			},
		},
  });
};

exports.removeActor = async (req, res) => {
  const { actorId } = req.params;

  if (!isValidObjectId(actorId))
    return res
      .status(401)
      .json({
        error:
          "The id present in the url params is not a valid object id or it might be undefined/null",
      });

  const actorToBeDeleted = await Actor.findById(actorId);

  if (!actorToBeDeleted)
    return res
      .status(401)
      .json({
        error:
          "There is no actor is the database to delete corresponding to the id in the url parameters",
      });

  const public_id = actorToBeDeleted.avatar?.public_id;

  if (public_id) {
    const { result } = await cloudinary.v2.uploader.destroy(public_id);
    if (result !== "ok")
      return res
        .status(401)
        .json({
          error: "Could not delete the image from cloudinary with id",
          public_id,
        });
  }

  await Actor.findByIdAndDelete(actorId);

  res.json({ message: "actor has been deleted successfully" });
};

exports.searchActor = async (req, res) => {
  // req.query === key value pair object of the query parameters
  const { query } = req;
  // const result = await Actor.find({ $text: { $search: `"${query.name}"` } }); we were using this to serach for exact matches and we did index the name in the actor model

  if(!query.name.trim()) return res.status(401).json({'error': 'You need to enter something before searching.'});

  const result = await Actor.find({name: {$regex: query.name, $options: 'i'}});

  // each object in result array has fields which we don't require: createdAt, updatedAt, __v
  const formattedResultArray = result.map((actor) => formatActor(actor));
  res.json({"results": formattedResultArray});
};

exports.getLatestActors = async (req, res) => {
  const latestActors = await Actor.find().sort({ createdAt: "-1" }).limit(12);
  const formattedLatestActorsArray = latestActors.map((actor) =>
    formatActor(actor),
  );
  res.json(formattedLatestActorsArray);
};

exports.getSingleActor = async (req, res) => {
  const { actorId } = req.params;

  if (!isValidObjectId(actorId))
    return res
      .status(401)
      .json({
        error:
          "The id present in the url params to search for a single actor is not a valid object id or it might be undefined/null",
      });

  const actor = await Actor.findById(actorId);

  if (!actor)
    return res
      .status(404)
      .json({
        error:
          "No actor was found in the db corresponding the the id present in the url params to get a single actor",
      });

  res.json(formatActor(actor));
};

exports.getActors = async (req, res) => {
  const {pageNo, limit} = req.query;

  const actorsForThisPage = await Actor.find({}).sort({createdAt: -1}).skip(parseInt(pageNo)*parseInt(limit)).limit(parseInt(limit));

  const profilesToRenderOnThisPage = actorsForThisPage.map((actor)=>formatActor(actor));
  
  // for(let actor of actorsForThisPage){
  //   profilesToRenderOnThisPage.push(formatActor(actor));
  // }

  res.json({"profiles": profilesToRenderOnThisPage})
}; 