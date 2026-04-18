const { validationResult } = require("express-validator");
const User = require("../models/User");
const { errorFormatter } = require("../middleware/errorFormater");

exports.userGetController = async (req, res, next) => {
  const user = await User.find();
  res.send(user);
};

exports.userGetControllerBYEmail = async (req, res) => {
  const email = req.params.email;
  const user = await User.findOne({ email: email })
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
  } catch (error) { }
};

exports.roleUpdateController = async (req, res, next) => {
  const { rol, email } = req.body;


  try {
    const user = await User.findOneAndUpdate(
      { email: email },
      { rol: rol },
      { new: true }
    );
    console.log(user)
    res.send(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
exports.userPutController = (req, res, next) => { };

exports.userDeleteController = async (req, res, next) => {
  const id = req.params.id

  try {
    const deletedUser = await User.findByIdAndDelete({ _id: id })
    res.status(200).json(deletedUser)

  } catch (error) {
    res.status(400).json(error.message)

  }
}

exports.updateProfileController = async (req, res, next) => {
  const data = req.body
  const email = req.params.email
  console.log(email);
  try {
    const profileData = {
      name: data.name,
      email: data.email,
      title: data.role,
      phone: data.phone,
      location: data.location,

      skills: data.skills,
      bio: data.bio,
      image: data.profileImage
    };

    const query = { email: email };

    const result = await User.findOneAndUpdate(
      query,
      profileData,
      {
        new: true,
        upsert: true,
      }
    );
  

    return res.status(200).send(result);

  } catch (error) {
    return res.status(400).send(error.message);

  }

}


exports.getProfileDataController = async(req, res, next) => {
  const email = req.params.email

  try {
    const result = await User.findOne({email:email})
    return res.status(200).send(result);



  } catch (error) {
    return res.status(400).send(error.message);

  }
}