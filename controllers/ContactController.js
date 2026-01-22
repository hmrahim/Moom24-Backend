const { sendEmail } = require("../middleware/sendEmail");
const Contact = require("../models/Contact");

exports.contactPostController = async (req, res, next) => {
  try {
    // frontend থেকে data আসছে req.body তে
    const { name, email, phone, message } = req.body;

    const result = new Contact({
      name,
      email,
      phone,
      message,
    });
    await result.save();

    if (result) {
      await sendEmail({
        name,
        email,
        phone,
        message,
      });
    }

    console.log(result);
    res.status(200).json({
      success: true,
      message: "Message sent successfully",
    });

    // সব ঠিক থাকলে success response
  } catch (error) {
    res.status(400).json({
      
      message: error.message,
    });
  }
};
