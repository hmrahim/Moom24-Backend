const { default: axios } = require("axios");
const { default: Visitor } = require("../models/Visitor");

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
