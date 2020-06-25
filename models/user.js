/*******************************USER SCHEMA*******************************************/
var mongoose = require('mongoose');
const crypto = require('crypto');
const uuidv1 = require('uuid/v1');

var userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,  // means DB always expect this value, without value it throws an error.
        maxlength: 32,
        trim: true // trim down all the extra space that comes 
    },
    lastname: {
        type: String,
        maxlength: 32,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true  // If Duplicate email occure DB should inform us 
    },
    userinfo: {
        type: String,
        trim: true
    },
    encry_password: {
        type: String,
        require: true
    },
    salt: String,  //Use for password
    role: {
        type: Number,
        default: 0
    },
    purchases: {    //No of items that user purchase that is push in an array
        type: Array,
        default: []
    }
  },
    { timestamps: true } // we can do filter operations based on this schema
  );

  //Virtual Fields
  userSchema.virtual("password")
    .set(function(password){
        this._password = password  //Private Variable mention using _ symbol
        this.salt = uuidv1();   // we have vietual password field and as soon as we set we convert it into encrypt password we set it here.
        this.encry_password = this.securePassword(password);
    })
    .get(function(){
        return this._password
    })
  

  //We are Defining Methods here.. whenever the securePassword run it convert the plain password to secure password
  userSchema.methods = {

    authenticate : function(plainpassword) {
        return this.securePassword(plainpassword) === this.encry_password
    },
    securePassword: function(plainpassword){
        if(!plainpassword) return "";
        try{
            return crypto.createHmac('sha256', this.salt)
            .update(plainpassword)
            .digest('hex');

        } catch(err) {
            return "";
        }
    }
  }

  module.exports = mongoose.model("User",userSchema)