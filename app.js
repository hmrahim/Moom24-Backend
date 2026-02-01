const express = require("express");
const { default: mongoose } = require("mongoose");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

const cors = require("cors");
const router = require("./router/routes");
const admin = require("firebase-admin");
const Product = require("./models/Product");
const xmlbuilder = require("xmlbuilder");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
}

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/google-feed.xml", async (req, res) => {
  try {
    const products = await Product.find().sort({ _id: -1 });

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
<title>moom24</title>
<link>https://moom24.com</link>
<description>Google Product Feed</description>
`;

    products.forEach((p) => {
      xml += `
<item>
<id>${p._id}</id>
<title><![CDATA[${p.name}]]></title>
<description><![CDATA[${p.desc || "No description"}]]></description>
<link>https://moom24.com/product-details/${p._id}</link>
<image_link>${p.image}</image_link>
<price>${p.price} sar</price>
<availability>in stock</availability>
<condition>new</condition>
</item>
`;
    });

    xml += `
</channel>
</rss>`;

    res.set("Content-Type", "application/xml");
    res.send(xml);
  } catch (error) {
    console.log("FEED ERROR => ", error);
    res.status(500).send("Feed Error");
  }
});

const middleware = [
  express.json(),
  express.urlencoded({ extended: true }),
  cors(),
];
app.use(express.static("public"));
app.use(middleware);
app.use("/api", router);

mongoose.connect(process.env.DB_URI).then(() => {
  console.log("database is connected");
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});
