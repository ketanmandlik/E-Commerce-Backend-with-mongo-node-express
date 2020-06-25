const express = require('express');
const router = express.Router();

const {getCategoryById, createCategory, getAllCategory, getCategory, updateCategory, removeCategory} = require('../controllers/category');
const {isAuthenticated, isAdmin, isSignedIn} = require('../controllers/auth');
const {getUserById} = require('../controllers/user');

//Finding a Specific User And Category by its ID
router.param("userId", getUserById); //Whenever it get Specific id it will populate that user
router.param("categoryId", getCategoryById); //For Specific category find

//Actual Routes
//1. Create Category Route || POST ROUTE
router.post("/category/create/:userId", isSignedIn, isAuthenticated, isAdmin, createCategory);
//2. Getting All Category Route || GET ROUTE
router.get("/categories", getAllCategory);
//3. Getting Specific Category || GET ROUTE
router.get("/category/:categoryId", getCategory);

//4. Update Route || PUT ROUTE
router.put("/category/:categoryId/:userId", isSignedIn, isAuthenticated, isAdmin, updateCategory);

//5. Delete Route || DELETE ROUTE
router.delete("/category/:categoryId/:userId", isSignedIn, isAuthenticated, isAdmin, removeCategory);


module.exports = router;