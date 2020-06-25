//Controller For User Route || user.js in routes
const User = require('../models/user');
const Order = require('../models/order');

//Middleware
exports.getUserById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if(err || !user){
            return res.status(400).json({
                err: "No User was Found in DB"
            });
        }
        req.profile = user;
        next();
    });
};

//This use Majorly
exports.getUser = (req, res) => {
    //TODO: get back here for password
    //req.profile.salt = "";
    //undefined dosen't shows the information to frontend user
    req.profile.salt = undefined;
    req.profile.encry_password = undefined;
    req.profile.createdAt = undefined;
    req.profile.updatedAt = undefined;
    return res.json(req.profile)
};

//Update Existing User in the DATABASE
exports.updateUser = (req, res) => {
    User.findByIdAndUpdate(
        {_id: req.profile._id}, //setting user in req.profile || Find User.
        {$set: req.body}, //we have to set all the updated values in $set, and they comes from front-end in req.body || Update User
        {new: true, useFindAndModify: false}, //Here we provide new field || Compulsary Parameters
        (err, updatedUser) => {
            if(err){
                return res.status(400).json({
                    error: "You are not Authorised to Update this User"
                });
            }
            updatedUser.salt = undefined;
            updatedUser.encry_password = undefined;
            res.json(updatedUser)
        }
    )
}

//User Purchase Order List, we are pulling this information from Order Model
//We are selecting Order which are based on req.profile._id.
//Here we are pulling Orders based on the order which are pushed into the model by particular User.
exports.userPurchaseList = () => {
    Order.find({user: req.profile._id})
    .populate("User","_id name")
    .exec((err, order) => {
        if(err){
            return res.status(400).json({
                error: "No Order in this Account"
            });
        }
        return res.json(order);
    })
}

exports.pushOrderInPurchaseList = (req, res, next) => {
    
    let purchases = []
    req.body.order.products.forEach(product => {
        purchases.push({
            _id: product._id,
            name: product.name,
            discription: product.discription,
            category: product.category,
            quantity: product.quantity,
            amount: req.body.order.amount,
            transaction_id: req.body.order.transaction_id
        })
    });
    
    //store this in DB
    User.findOneAndUpdate(
        {_id: req.profile._id},
        {$push: {purchases: purchases}}, //Update 
        {new: true}, //Means send me the updated Object
        (err, purchases) => {
            if(err){
                return res.status(400).json({
                    error: "Unable to save Purchase List"
                });
            };
            next();
        }
    )   
}