const Marquee = require("../models/Marquee");

/* ============================
   CREATE MARQUEE  (POST)
============================ */
exports.marqueePostController = async (req, res) => {
  try {
    const { text, status } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Marquee text is required",
      });
    }

    const marquee = new Marquee({
      text,
      status,
    });

    await marquee.save();
    console.log(marquee);

    res.status(200).json({
      success: true,
      message: "Marquee created successfully",
      data: marquee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ============================
   GET ALL MARQUEES  (GET)
============================ */
exports.marqueeGetController = async (req, res) => {
  try {
    const marquees = await Marquee.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: marquees.length,
      data: marquees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ============================
   GET SINGLE MARQUEE (GET)
============================ */
exports.marqueeGetControllerById = async (req, res) => {
  try {
    const { id } = req.params;

    const marquee = await Marquee.findById(id);

    if (!marquee) {
      return res.status(404).json({
        success: false,
        message: "Marquee not found",
      });
    }

    res.status(200).json({
      success: true,
      data: marquee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ============================
   UPDATE MARQUEE (PUT)
============================ */
exports.marqueePutController = async (req, res) => {
  try {
    const { id } = req.params;

    const marquee = await Marquee.findByIdAndUpdate(
      { _id: id },
      { text: req.body.text },
      { new: true },
    );

    if (!marquee) {
      return res.status(404).json({
        success: false,
        message: "Marquee not found",
      });
    }

    console.log(marquee);

    res.status(200).json({
      success: true,
      message: "Marquee updated successfully",
      data: marquee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ============================
   DELETE MARQUEE (DELETE)
============================ */
exports.marqueeDeleteController = async (req, res) => {
  try {
    const { id } = req.params;


    const marquee = await Marquee.findByIdAndDelete(id);

    if (!marquee) {
      return res.status(404).json({
        success: false,
        message: "Marquee not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Marquee deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
