const User = require("../models/user");
const { check, validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");

//User Sign-up--> We take user detail in user model
exports.signup = (req, res) => {
  console.log("REQ BODY", req.body);
  //    res.json({
  //        message: "Signup Route Works"
  //    });

  // Validation-Result
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    return res.status(422).json({
      errors: errors.array(),
      // errors: errors.array()[0].msg,
      // field: errors.array()[0].param
    });
  }
  // Adding User do Databse
  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: "NOT able to save user in DB", // This response is for Frontend-User
      });
    }
    res.json(user); //Fields Present in User-Model
    // res.json({
    //     name: user.name,
    //     email: user.email, // This Displays to Frontend User.
    //     id: user._id
    // });
  });
};

/* User Sign-in--> Process
Here 1st we check user is passing email and password
Then we check email existing in DB or not, Then we check password is correct or not
Then we logged in User */
exports.signin = (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array()[0].msg,
    });
  }
  //Finding Email in Database
  User.findOne({ email }, (err, user) => {
    //If there is a error or we don't be able to find user in database
    if (err || !user) {
      return res.status(400).json({
        error: "USER email does not exists",
      });
    }
    //Below if executes if authentication fails
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email and Password do not Match",
      });
    }
    /* Here if we find user in database and authenticate we are now SIGN-IN User--> Create Token And Put in Cookies */
    //Create Token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);
    //Put token in cookie
    res.cookie("token", token, { expire: new Date() + 9999 });

    //send response to front end
    const { _id, name, email, role } = user;
    return res.json({ token, user: { _id, name, email, role } });
  });
};

//User Sign-out
exports.signout = (req, res) => {
  //Clear-Cookie
  res.clearCookie("token");
  res.json({
    message: "User Signout Successfully",
  });
};

//protected routes
//isSignedIn Simply works as Checker for Token
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth",
});

//custom middlewares

exports.isAuthenticated = (req, res, next) => {
  //req.profile set it from front-end, req.auth set from isSignedIn
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return res.status(403).json({
      error: "ACCESS DENIED",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "You are not ADMIN, Access Denied",
    });
  }
  //res.json({ message: 'Welcome Admin' })
  next();
};
