const User = require("../models/User");

exports.getRiderController = async (req, res, next) => {
  const riders = await User.find({ rol: "rider" }).populate(["orders"]).exec();
  res.send(riders);
};

exports.getRiderByEmailController = async (req, res, next) => {
  const email = req.params.email;
  const rider = await User.findOne({ email: email, rol: "rider" })
    .populate("orders")
   
    .exec();

  res.send(rider);
};

exports.getAllRidersDataController = async (req, res, next) => {
  const email = req.params.email;
  try {
    const now = new Date();

    // today start
    const startToday = new Date();
    startToday.setHours(0, 0, 0, 0);

    // last 7 days
    const startWeek = new Date();
    startWeek.setDate(now.getDate() - 7);

    // last 30 days
    const startMonth = new Date();
    startMonth.setDate(now.getMonth() - 30);

    const data = await User.aggregate([
      { $match: { email, rol: "rider" } },

  // Convert string IDs to ObjectId if needed (skip if already ObjectId)


  { $unwind: { path: "$orders", preserveNullAndEmptyArrays: true } },

  // Populate order data
  {
    $lookup: {
      from: "confirmorders",
      localField: "orders",
      foreignField: "_id",
      as: "confirmorders"
    }
  },

  { $unwind: { path: "$confirmorders", preserveNullAndEmptyArrays: true } },

  // Convert createdAt to Date if stored as string
  {
    $addFields: {
      "confirmorders.createdAt": { $toDate: "$confirmorders.createdAt" }
    }
  },

  // Split into day/week/month
  {
    $facet: {
      today: [
        { $match: { "confirmorders.createdAt": { $gte: startToday } } }
      ],
      week: [
        { $match: { "confirmorders.createdAt": { $gte: startWeek } } }
      ],
      month: [
        { $match: { "confirmorders.createdAt": { $gte: startMonth } } }
      ]
    }
  }
    ]);
    // const data = await User.findOne({ email: email, rol: "rider" }).populate(["orders"])

    res.send(data[0]);
  } catch (error) {
    res.send(error);
  }
};
