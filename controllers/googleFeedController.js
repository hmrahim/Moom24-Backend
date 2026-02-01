const xmlbuilder = require("xmlbuilder");
const Product = require("../models/Product");

exports.generateGoogleFeed = async (req, res, next) => {
  try {
    const products = await Product.find({});

    const feed = xmlbuilder
      .create("rss", { encoding: "UTF-8" })
      .att("version", "2.0")
      .att("xmlns:g", "http://base.google.com/ns/1.0");

    const channel = feed.ele("channel");
    channel.ele("title", "Your Store Name");
    channel.ele("link", "https://yourwebsite.com");
    channel.ele("description", "Product Feed");

    products.forEach((p) => {
      const item = channel.ele("item");
      item.ele("g:id", p._id.toString());
      item.ele("g:title", p.name);
      item.ele("g:description", p.description);
      item.ele("g:link", `https://yourwebsite.com/api/product/${p.id}`);
      item.ele("g:image_link", p.image);
      item.ele("g:price", `${p.price} USD`);
      item.ele("g:availability", "in stock");
      item.ele("g:condition", "new");
    });

    res.set("Content-Type", "application/xml");
    res.send(feed.end({ pretty: true }));
  } catch (error) {
    res.status(500).send("Feed Error");
  }
};
