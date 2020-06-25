const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs"); //fs is file system it is used to handel a path of the file which we want to use, this is inbuild method
// of nodejs

exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category") //This Line indicates Getting Product Based On Category
    .exec((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Not Getting Product",
        });
      }
      req.product = product;
      next();
    });
};

exports.getProduct = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

//MIDDLEWARE
exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

exports.createProduct = (req, res) => {
  //Here we use formidable
  let form = new formidable.IncomingForm();
  //this is to save the extensions of files like png, jpg etc
  form.keepExtensions = true;
  //parse
  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Problem with Image",
      });
    }

    //destructure the fields, in fields we are receving many live fields.price, fields.name etc. to make it simple
    const { name, discription, price, category, stock } = fields;

    //Ristrictions on Route
    if (!name || !discription || !price || !category || !stock) {
      return res.status(400).json({
        error: "Please inculde all Fields",
      });
    }

    //New product created based on this fields
    let product = new Product(fields);

    // Handle File Here or Photo
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size is to Big",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path); //Here we pass it to formidable to access the path
      product.photo.contentType = file.photo.type; // to save extensions to BD
    }
    console.log(product);
    // Saving Photo To DB
    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Saving tshirt in DB Failed",
        });
      }
      res.json(product);
    });
  });
};

// delete controllers
exports.deleteProduct = (req, res) => {
  let product = req.product;
  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to Deleted Product",
      });
    }
    res.json({
      message: "Deletion Success",
      deletedProduct,
    });
  });
};

//update product
exports.updateProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  //this is to save the extensions of files like png, jpg etc
  form.keepExtensions = true;
  //parse
  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Problem with Image",
      });
    }

    //Updation Code
    let product = req.product;

    //Method of Lodash, extends value and update, it takes the new values in fields and update in product
    product = _.extend(product, fields);

    // Handel File Here or Photo
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size is to Big",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path); //Here we pass it to formidable to access the path
      product.photo.contentType = file.photo.type; // to save extensions to BD
    }
    // console.log(product);
    // Saving Photo To DB
    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Updation Product Failed",
        });
      }
      res.json(product);
    });
  });
};

//Listing product
exports.getAllProducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

  Product.find()
    .select("-photo") // dont select photo
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: "No product Found",
        });
      }
      console.log(products);
      res.json(products);
    });
};

//MIDDLEWARE for updateStock
exports.updateStock = (req, res, next) => {
  /**Here we have a cart and in cart there are many Orders so we have to loop through cart and grab every single single item which we
   * want to Update.
   * In every single product we perform 2 operations update and delete
   */
  let myOperations = req.body.order.products.map((prod) => {
    return {
      updateOne: {
        filter: { _id: prod._id }, //Find product by _id
        update: { $inc: { stock: -prod.count, sold: +prod.count } }, //.count are coming from front-end
      },
    };
  });

  Product.bulkWrite(myOperations, {}, (err, products) => {
    if (err) {
      return res.status(400).json({
        error: "Bulk Operation Failed",
      });
    }
    next();
  });
};

//Get All Categories which is used to select category while creating a Product
exports.getAllUniqueCategories = (req, res) => {
  Product.distinct("category", {}, (err, category) => {
    if (err) {
      return res.status(400).json({
        error: "No Category Found",
      });
    }
    res.json(category);
  });
};
