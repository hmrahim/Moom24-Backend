const {body} = require("express-validator");
const User = require("../models/User");

const userValidator = [
    body("name")
    .not()
    .isEmpty()
    .withMessage("Email is required")
    .trim(),
    body("email")
    .not()
    .trim()
    .isEmpty().withMessage("Email is required")
    .custom(async(email)=> {
         const userEmail = await User.findOne({ email });
      if (userEmail) {
        return Promise.reject("Email is already exist");

    }}),
    
]

module.exports = userValidator