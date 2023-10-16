const express = require("express");
const router = express.Router();

const { createActor, updateActor, removeActor, searchActor, getLatestActors, getSingleActor } = require("../controllers/actor");
const { uploadImage } = require("../middlewares/multer");
const { actorInfoValidator, validate } = require("../middlewares/validators");
const { isAuth, isAdminAuth } = require("../middlewares/auth");

router.post("/create", isAuth, isAdminAuth, uploadImage.single("avatar"), actorInfoValidator, validate, createActor );

router.post("/update/:actorId", isAuth, isAdminAuth, uploadImage.single("avatar"), actorInfoValidator, validate, updateActor);

router.delete("/delete/:actorId", isAuth, isAdminAuth, removeActor);

router.get("/search", isAuth, isAdminAuth, searchActor);

router.get("/latest-uploads", isAuth, isAdminAuth, getLatestActors);

router.get("/single/:actorId", getSingleActor);

module.exports = router;
