const { validationResult } = require("express-validator");
const Category = require("../models/Category");
const { errorFormatter } = require("../middleware/errorFormater");

exports.categoryGetController = async (req, res, next) => {
  const category = await Category.find();
  res.send(category);
};
exports.categoryGetByIdController = async (req, res, next) => {
  const id = req.params.id;
  const category = await Category.findOne({ _id: id });
  res.send(category);
};
exports.categoryPostController = async (req, res, next) => {
  const err = validationResult(req).formatWith(errorFormatter);
  if (!err.isEmpty()) {
    const error = err.mapped();
  }
  try {
    const data  = req.body;

    const category = new Category(data);
    await category.save();
    // console.log(category);
    res.send(category);
  } catch (error) {
    // console.log(error);
    res.send(error);
  }
};



exports.categoryPutController = async (req, res, next) => {
  const id = req.params.id;
  const  data  = req.body;
  try {
    const query = { _id: id };
    const docs = {
      $set: { name:data.name},
    };
    const result = await Category.findByIdAndUpdate(query, docs, { new: true });
  
    res.send(result);
  } catch (error) {}
};



exports.categoryDeleteController = async(req,res,nect) => {
  const id = req.params.id
  const result = await Category.findByIdAndDelete({_id:id})
  // console.log(result);

};
