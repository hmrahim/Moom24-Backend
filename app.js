const express = require("express");
const { default: mongoose } = require("mongoose");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

const cors = require("cors");
const router = require("./router/routes");
const admin = require("firebase-admin");

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
const middleware = [
  express.json(),
  express.urlencoded({ extended: true }),
  cors(),
];
app.use(middleware);
app.use("/api", router);

mongoose.connect(process.env.DB_URI).then(() => {
  console.log("database is connected");
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});
