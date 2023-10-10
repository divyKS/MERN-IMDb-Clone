// check function is provided by express-validator
const {check, validationResult} = require('express-validator');
const genres = require('../utils/genres');
const { isValidObjectId } = require('mongoose');

// check('field'): field should be same as the key that we use in postman/axios to send request
exports.userValidator = [
    check('name').trim().not().isEmpty().withMessage("Name is missing!"),
    check('email').normalizeEmail().isEmail().withMessage("Email is invalid!"),
    check('password').trim().not().isEmpty().withMessage("Password is missing").isLength({min:4, max:10}).withMessage("Password length needs to be in [4,10]")
];
exports.passwordValidator = [
    check('password').trim().not().isEmpty().withMessage("Password is missing").isLength({min:4, max:10}).withMessage("Password length needs to be in [4,10]")
];
exports.signInValidator = [
    check('email').normalizeEmail().isEmail().withMessage("Email is invalid!"),
    check('password').trim().not().isEmpty().withMessage("Password is missing")
];

exports.actorInfoValidator = [
    check('name').trim().not().isEmpty().withMessage("Name is missing!"),
    check('about').trim().not().isEmpty().withMessage("About is missing!"),
    check('gender').trim().not().isEmpty().withMessage("Gender is missing!")
];

exports.validateMovie = [
    check('title').trim().not().isEmpty().withMessage('Movie title is missing'),
    check('storyLine').trim().not().isEmpty().withMessage('Movie story line is missing'),
    check('language').trim().not().isEmpty().withMessage('Movie language is missing'),
    check('type').trim().not().isEmpty().withMessage('Movie type is missing'),
    check('releaseDate').isDate().withMessage('Movie release date is missing'),
    check('status').isIn(['public', 'private']).withMessage('Movie status can be public or private'),
    check('genres').isArray().withMessage('Generes must be an array of strings!').custom((genreArrayFromFrontend)=>{
        for(let genre of genreArrayFromFrontend){
            if(!genres.includes(genre)) throw Error('Invalid genres');
        }
        return true;
    }),
    check('tags').isArray({min: 1}).withMessage('Tags must be an array of strings!').custom((tagsArrayFromFrontend)=>{
        for(let tag of tagsArrayFromFrontend){
            if(typeof(tag) !== "string") throw Error('Each individual tag has to be a string');
        }
        return true;
    }),
    check('cast').isArray().withMessage('Cast must be an array of objects!').custom((castFromFrontend)=>{
        for(let item of castFromFrontend ){
            if(!isValidObjectId(item.actor)) throw Error('Invalid cast _id');
            if(!item.roleAs?.trim()) throw Error('Role attribute missing in cast');
            if(typeof(item.leadActor) !== 'boolean') throw Error('Only boolean values are accepted inside the lead actor attribute of cast');
        }
        return true;
    }),
    check('trailer').isObject().withMessage('Trailer has to be an object').custom(({url, public_id})=>{
        try {
            const result = new URL(url);
            if(!result.protocol.includes('http')) throw Error('trailer url is not a valid url, it does not include http');
            const publicIdFromURL = url.split('/').pop().split('.')[0];
            if(publicIdFromURL !== public_id) throw Error('Trailer public_id is invalid');
        } catch (error) {
            console.log(error);
            throw Error('trailer url is not a valid url');
        }
        return true;
    }),
    // check('poster').custom((value, {req})=>{
    //     // we can't do this inside of multer validator imageFileFilter because they would simply not run if no file was attached
    //     if(!req.file) throw Error('Poster file is missing');
    //     return true;
    // })
    // director and writers are optional fields so their validation can be handeled in the controller
];

// middleware to print the 'withMessage' from above
exports.validate = (req, res, next) => {
    const error = validationResult(req).array();
    // error would have all things checked at once and all errors in the array, but we are just printing one error at a time, and letting user fix that one field
    if(error.length){
        return res.json({"error": error[0].msg});
    }
    // console.log(error);
    next();
}
