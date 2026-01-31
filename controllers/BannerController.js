const Banner = require("../models/banner");

exports.postBannerController = async (req, res, next) => {
  const { image, title, desc } = req.body;

  try {
    const result = new Banner({ image, title, desc });

    await result.save();

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.getAllBanners = async (req, res, next) => {
  const banner = await Banner.find().sort({ _id: -1 });
  res.status(200).json(banner);
};

exports.getBannerById = async (req, res, next) => {
  const id = req.params.id;

  const banner = await Banner.findById({ _id: id }).sort({ _id: -1 });
  res.status(200).json(banner);
};

exports.updateBannerController = async (req, res, next) => {
  const id = req.params.id;

  const { image, title, desc } = req.body;
  try {
    const banner = await Banner.findByIdAndUpdate(
      { _id: id },
      { image, title, desc },
      { new: true },
    );

    res.status(200).json(banner);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.deleteBannerController = async (req, res, next) => {
  const id = req.params.id;
  console.log(id);
  try {
    await Banner.findByIdAndDelete({ _id: id });
    res.status(200).json({ message: "Banner deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
