/*******************************CATEGORY SCHEMA*******************************************/
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        maxlength: 32,
        required: true,
        unique: true
    }
}, 
    { timestamps: true } //Whenever we make new entry through this schema it records the created time and stored in DB
);

module.exports = mongoose.model("Category", categorySchema);