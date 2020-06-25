/*******************************ORDER AND PRODUCTCART SCHEMA*******************************************/

const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;

const ProductCartSchema = new mongoose.Schema({
    product:{
        type: ObjectId, // This refers to Product Schema to check which product is added in cart
        ref: "Product"
    },
    name: String,
    count: Number,
    price: Number

});

const ProductCart = mongoose.model("ProductCart",ProductCartSchema);

const OrderSchema = new mongoose.Schema({
    // This schema of products array is the order page schema or product present in cart
    products: [ProductCartSchema],
    transaction_id : {},
    amount: { type: Number },
    address: String,
    status: {
        type: String,
        default: "Recieved",
        enum:["Cancelled", "Delivered", "Shipped", "Processing", "Recieved"]
    },
    update: Date,
    user: {
        type: ObjectId, // Refers user schema to find which order is associate with which user
        ref: "User"
    }
}, 
    { timestamps: true }
);

const Order = mongoose.model("Order",OrderSchema);

module.exports = { Order, ProductCart }