const { validationResult } = require("express-validator");
const User = require("../models/User");
const { errorFormatter } = require("../middleware/errorFormater");

exports.userGetController = async (req, res, next) => {
  const user = await User.find();
  res.send(user);
};

exports.userGetControllerBYEmail = async(req, res) => {
  const email = req.params.email;
  const user = await User.findOne({email:email})
  res.send(user)
  
};
exports.userPostController = async (req, res, next) => {
  const { name, email } = req.body;
  const dataData = {
    name: name,
    email: email,
    rol: "user",
    image: "",
  };
 
  const error = validationResult(req).formatWith(errorFormatter);
  if (!error.isEmpty()) {
    const err = error.mapped();
    // console.log(err);
    return false;
  }
  try {
    const user = new User(dataData);
    await user.save();
    
    res.send(user);
  } catch (error) {}
};
exports.userPutController = (req, res, next) => {};
