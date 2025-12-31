const { errorFormatter } = require("../middleware/errorFormater");
const Product = require("../models/Product");
const { validationResult } = require("express-validator");

exports.productGetController = async (req, res, next) => {
  const data = await Product.find();

  res.send(data);
};

exports.productPostController = async (req, res, next) => {
  const error = validationResult(req).formatWith(errorFormatter);
  if (!error.isEmpty()) {
    const err = error.mapped();
    // console.log(err);
    return res.status(400).json({
      errors: err,
    });
  }
  try {
    const data = req.body;
    const product = new Product(data);
    await product.save();
    
  res.send({status:200});
  } catch (error) {
    res.send(error);
  }
};

exports.productFindOneById = async (req, res, next) => {
  const id = req.params.id;
  const product = await Product.findOneAndUpdate({ _id: id });
  res.send(product);
};

exports.productPutController = async (req, res, next) => {
  const id = req.params.id;
  const product = req.body;
  try {
    const query = { _id: id };
    const docs = {
      $set: product,
    };
    const result = await Product.findOneAndUpdate(query, docs, { new: true });
    
    res.send(result);
  } catch (error) {}
};
exports.productDeleteController = async (req, res, next) => {
  const id = req.params.id;
  const result = await Product.findOneAndDelete({ _id: id });
  res.send(result);

  // console.log(result);
};

exports.productSeacrhController = async (req, res, next) => {
  const text = req.query.text;
  const data = await Product.find({
    $or: [
      { name: { $regex: text, $options: "i" } },
      { price: { $regex: text, $options: "i" } },
      { category: { $regex: text, $options: "i" } },
      { brand: { $regex: text, $options: "i" } },
      { image: { $regex: text, $options: "i" } },
      { discount: { $regex: text, $options: "i" } },
      { desc: { $regex: text, $options: "i" } },
      { country: { $regex: text, $options: "i" } },
      
    ],
  });

  
  res.send(data);

};
