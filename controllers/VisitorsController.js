const { default: axios } = require("axios");
const { default: Visitor } = require("../models/Visitor");
const ConfirmOrder = require("../models/ConfirmOrders");

exports.visitorsPostController = async (req, res, next) => {
  const data = req.body;
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  //   let locationData = {};

  try {
    const response = await axios.get(
      `https://ipinfo.io/${ip}?token=${process.env.API_INFO}`,
    );

    const visitorData = {
      ip: ip,
      location: response.data,
      ...data,
    };
    const result = new Visitor(visitorData);
    // console.log(resut)
    await result.save();

    res.send(result);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.visitorsGetController = async (req, res, next) => {
  const date = req.query.date;
  try {
    const startOfToday = new Date(date);
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date(date);
    endOfToday.setHours(23, 59, 59, 999);

    const result = await Visitor.find({
      visitedAt: {
        $gte: startOfToday,
        $lte: endOfToday,
      },
    }).sort({ _id: -1 });
    res.send(result);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.getCurrentLocation = async (req, res, next) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  try {
    const response = await axios.get(
      `https://ipinfo.io/${ip}?token=${process.env.API_INFO}`,
    );

    const visitorData = {
      ip: ip,
      location: response.data,
    };

    return res.json(visitorData);
  } catch (error) {
    return res.json({ error: "Location fetch failed" }, { status: 500 });
  }
};

// ==========all controller for charts===============================


exports.getMonthlyVisitors = async (req, res,next) => {
  try {
    const { year, month } = req.query;
    // month: 1-12

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const data = await Visitor.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lt: endDate,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          visitors: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          date: "$_id",
          visitors: 1,
        },
      },
    ]);

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMonthlyOrderStatus = async (req, res,next) => {
try {
    const year = parseInt(req.query.year);
    const month = parseInt(req.query.month);

    if (!year || !month) {
      return res.status(400).json({ message: "Year and month are required" });
    }

    // Start & end of month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    // aggregation using createdAt as orderDate
    const result = await ConfirmOrder.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $project: {
          day: { $dayOfMonth: "$createdAt" }, // use createdAt as order date
          status: 1,
        },
      },
      {
        $group: {
          _id: { day: "$day", status: "$status" },
          count: { $sum: 1 },
        },
      },
    ]);

    // Prepare monthly array
    const daysInMonth = new Date(year, month, 0).getDate();
    const monthlyData = Array.from({ length: daysInMonth }, (_, i) => ({
      day: String(i + 1),
      delivered: 0,
      pending: 0,
      cancelled: 0,
      confirmed: 0,
    }));

    // Fill aggregation data
    result.forEach((item) => {
      const dayIndex = item._id.day - 1;
      const status = item._id.status.toLowerCase();

      // normalize status: delivered/pending/cancelled/confirmed
      if (status === "delivered") monthlyData[dayIndex].delivered = item.count;
      else if (status === "pending") monthlyData[dayIndex].pending = item.count;
      else if (status === "cancelled") monthlyData[dayIndex].cancelled = item.count;
      else monthlyData[dayIndex].confirmed = item.count; // everything else as confirmed
    });

    return res.status(200).json(monthlyData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }

 
};