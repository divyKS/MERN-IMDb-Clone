const { isAuth, isAdminAuth } = require('../middlewares/auth');
const {getAppInfo, getMostRated} = require('./../controllers/admin');

const router = require('express').Router();

router.get('/app-info', isAuth, isAdminAuth, getAppInfo);

router.get('/most-rated', isAuth, isAdminAuth, getMostRated);

module.exports = router;