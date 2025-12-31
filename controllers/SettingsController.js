const WebsiteSetting = require("../models/WebsiteSettings");
const axios = require("axios");
const FormData = require("form-data");

exports.settingsPostController = async (req, res, next) => {
  const data = req.body;

  try {
    const file = req.file;

    if (!file) {
      // return res.status(400).json({ message: "No file uploaded" });

      const settingsData = {
        websiteName: data.websiteName,
        email: data.email,
        address: data.address,
        phone: data.phone,
        copyright: data.copyright,
        social: {
          facebook: data.facebook,
          instagram: data.instagram,
          twitter: data.twitter,
        },
        aboutText: data.about,
      };

      const query = { type: "website_setting" };

      const result = await WebsiteSetting.findOneAndUpdate(
        query,
        settingsData,
        {
          new: true,
          upsert: true,
        }
      );

      return res.send(result);
    }

    const form = new FormData();
    form.append("image", file.buffer.toString("base64"));

    const imgbbRes = await axios.post(
      `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_KEY}`,
      form,
      { headers: form.getHeaders() }
    );

    const settingsData = {
      websiteName: data.websiteName,
      email: data.email,
      address: data.address,
      phone: data.phone,
      copyright: data.copyright,
      social: {
        facebook: data.facebook,
        instagram: data.instagram,
        twitter: data.twitter,
      },
      aboutText: data.about,
      logo: {
        displayUrl: imgbbRes.data.data.display_url,
        deleteUrl: imgbbRes.data.data.delete_url,
      },
    };

    const query = { type: "website_setting" };

    const result = await WebsiteSetting.findOneAndUpdate(query, settingsData, {
      new: true,
      upsert: true,
    });

    return res.send(result);
  } catch (error) {
    res.send(error);
  }
};

exports.getSettingsData = async (req, res, next) => {
  const data = await WebsiteSetting.findOne({ type: "website_setting" });
  return res.send(data);
};
