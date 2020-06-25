//This file Handle all the Routes Associated with user
var express = require('express');
const router = express.Router();
const {getUser , getUserById, updateUser, userPurchaseList} = require('../controllers/user');
const {isSignedIn, isAuthenticated, isAdmin} = require('../controllers/auth')

//method getUserById populate my request.profile
//Get User by ID
router.param("userId", getUserById) 


router.get("/user/:userId",isSignedIn, isAuthenticated, getUser);
router.put("/user/:userId",isSignedIn, isAuthenticated, updateUser);

router.get("/orders/user/:userId",isSignedIn, isAuthenticated, userPurchaseList);

module.exports = router;
