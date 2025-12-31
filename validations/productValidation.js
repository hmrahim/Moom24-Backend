const { body } = require("express-validator");
const productValidation = [
  body("name").not().trim().isEmpty().withMessage("Name is required"),
  body("price").not().isEmpty().withMessage("Price is required"),
  body("category").not().trim().isEmpty().withMessage("Category is required"),
  body("brand").not().trim().isEmpty().withMessage("Brand is required"),
  body("image").not().trim().isEmpty().withMessage("Image is required"),
  body("country").not().trim().isEmpty().withMessage("Country is required"),
  body("discount").optional().trim(),
  body("desc").optional().trim(),
  body("price").isNumeric().withMessage("Price must be a number"),

  body("name")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),
  body("brand")
    .isLength({ min: 2 })
    .withMessage("Brand must be at least 2 characters long"),
  body("category")
    .isLength({ min: 2 })
    .withMessage("Category must be at least 2 characters long"),
  body("country")
    .isLength({ min: 2 })
    .withMessage("Country must be at least 2 characters long"),
  body("desc")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Description can be up to 500 characters long"),
  body("image").isURL().withMessage("Image must be a valid URL"),

  body("price").custom((value) => {
    if (parseFloat(value) <= 0) {
      throw new Error("Price must be greater than zero");
    }
    return true;
  }),
];

module.exports = productValidation;
