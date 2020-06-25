const express = require("express");
const router = express.Router();

//Coming Form Controllers
const {
  getProductById,
  getProduct,
  createProduct,
  photo,
  updateProduct,
  getAllProducts,
  getAllUniqueCategories,
  deleteProduct,
} = require("../controllers/product");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById, getUser } = require("../controllers/user");

//Param
router.param("userId", getUserById);
router.param("productId", getProductById);

//Actual Route
//Create Route
router.post(
  "/product/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createProduct
);
//Read Routes
router.get("/product/:productId", getProduct);
router.get("/product/photo/:productId", photo);

//Delete Route
router.delete(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  deleteProduct
);

//Update Route
router.put(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateProduct
);

//Listing Route --> on home page we see available products
router.get("/products", getAllProducts);

router.get("/products/Categories", getAllUniqueCategories);

module.exports = router;
