const {body} = require("express-validator")

const categoryValidator = [
    body("name")
    .not()
    .trim()
    .isEmpty().withMessage("Category is required")
]

module.exports = categoryValidator