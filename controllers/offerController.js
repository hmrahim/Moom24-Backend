const Offer = require("../models/Offers");

exports.offerPostController = async (req, res, next) => {
  const { title, minAmount, status } = req.body;
  console.log(req.body);
  try {
    const offer = new Offer({
      title,
      minAmount,
      status,
    });

    await offer.save();
    console.log(offer);
    res.status(200).json({
      message: "Offer created successfully",
      offer,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllOffersController = async (req, res, next) => {
  try {
    const offers = await Offer.find();
    res.status(200).json(offers);
  } catch (error) {
    next(error);
  }
};

exports.offerDeleteController = async (req, res, next) => {
  const id = req.params.id;
  console.log(id);
  try {
    const offer = await Offer.findByIdAndDelete({ _id: id });
    if (!offer) {
      return res.status(404).json({
        message: "Offer not found",
      });
    }
    res.status(200).json({
      message: "Offer deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.offerPutController = async (req, res, next) => {
  const id = req.params.id;
  const { status } = req.body;
  console.log(status);
 
  try {
    const offer = await Offer.findByIdAndUpdate({ _id: id }, {status:status}, {
      new: true,
    });
    if (!offer) {
      return res.status(404).json({
        message: "Offer not found",
      });
    }
     console.log(offer);
    res.status(200).json({
      message: "Offer updated successfully",
      offer,
    });
  } catch (error) {
    next(error);
  }
};


exports.getActiveOffer = async (req, res, next) => {
  try {
    const activeOffers = await Offer.findOne({ status: true });
    res.status(200).json(activeOffers);
  } catch (error) {
    next(error);
  }
};
