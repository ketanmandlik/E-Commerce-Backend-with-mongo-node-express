
const Category = require('../models/category');

//Getting Category by ID (MIDDLEWARE)
exports.getCategoryById = (req, res, next, id) => {
    Category.findById(id).exec((err, cate) => {
        if(err){
            return res.status(400).json({
                error: "Category not found in DB"
            });
        }
        req.category = cate;
        next();
    });
};

//Create Category
exports.createCategory = (req, res) => {
    const category = new Category(req.body)
    category.save((err, category) =>{
        if(err){
            return res.status(400).json({
                error: "You are Not Allowed to Create Category"
            });
        }
        res.json({category});
    });
}

//Getting all Categories
exports.getAllCategory = (req, res) => {
    Category.find().exec((err, categories) => {
        if(err){
            return res.status(400).json({
                error: "No Categories Are Created"
            });
        }
        res.json({ categories });
    });
}

//Getting Single Category with the help of getCategoryById MIDDLEWARE
exports.getCategory = (req, res) => {
    return res.json(req.category);
}

//Update Category
exports.updateCategory = (req, res) => {
    const category = req.category; // We are populating category from req.category because of the getCategoryById MIDDLEWARE
    category.name = req.body.name; // Because of our middleware we are able to get category And here we are updating a name
    category.save((err, updatedCategory) => { //Then we Save updated category to DB and give Response
        if(err){
            return res.status(400).json({
                error: "Failed to Update Category"
            });
        }
        res.json(updatedCategory);
    });
};

//Delete Category
exports.removeCategory = (req, res) => {
    const category = req.category;
    category.remove((err, category) => {
        if(err){
            return res.status(400).json({
                error: "Falied to Delete Category"
            });
        }
        res.json({
            message: "Successfully Deleted"
            //message: `${category} is Deleted Successfully`

        });
    });
}