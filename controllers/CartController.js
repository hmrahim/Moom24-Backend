const Cart = require("../models/Cart");
const ConfirmOrder = require("../models/ConfirmOrders");
const User = require("../models/User");
const nodemailer = require("nodemailer");
const sgMail = require("@sendgrid/mail");
const { default: PromoCode } = require("../models/PromoCode");
const { json } = require("express");
const { getDistance } = require("geolib");

exports.CartPostController = async (req, res, next) => {
  const email = req.body.email;
  const id = req.body.id;
  // const id = await Cart.findOne({ id: data.id });
  // const email = await Cart.findOne({ email: data.email });
  const findByEmail = await Cart.find({ email: email });
  const cart = findByEmail.find((cart) => cart.id === id);
  if (cart) {
    return res.send({
      error: 400,
      message: "Product is already added, You can update quantity.",
    });
  }

  try {
    const result = new Cart(req.body);

    await result.save();
    res.send({
      success: 200,
      message: "Product added to cart, please choice new products",
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.CartGetController = async (req, res, next) => {
  const email = req.params.email;
  const data = await Cart.find({ email: email });
  const distence = await ConfirmOrder.findOne({
    email: email,
    status: "unconfirmed",
  });

  const withDscount = data?.filter((data) => data.discount !== "");
  const withoutDiscount = data?.filter((data) => data.discount === "");

  const amountWithOutDiscount = withoutDiscount?.reduce(
    (previousValue, currentValue) => {
      return (
        previousValue +
        Number(currentValue.price) * Number(currentValue.quantity)
      );
    },
    0
  );

  const discAmount = withDscount?.reduce((previousValue, currentValue) => {
    return (
      previousValue +
      (Number(currentValue.price) *
        Number(currentValue.quantity) *
        Number(currentValue.discount)) /
        100
    );
  }, 0);

  const totalAmount = withDscount?.reduce((previousValue, currentValue) => {
    return (
      previousValue + Number(currentValue.price) * Number(currentValue.quantity)
    );
  }, 0);

  const totalAmoutWithDIscountAndWithoutDiscount =
    totalAmount - discAmount + amountWithOutDiscount;

  res.status(200).json({
    data: data,
    totalAmount: totalAmoutWithDIscountAndWithoutDiscount,
    distence: distence?.distence,
  });
};

exports.CartDeleteController = async (req, res, next) => {
  const id = req.params.id;
  const result = await Cart.findOneAndDelete({ _id: id });

  res.send(result);
};

exports.CartUpdateController = async (req, res, next) => {
  const id = req.params.id;
  const data = req.body;
  // const quantity = Number(req.body.quantity) +1
  try {
    const query = { _id: id };
    const docs = {
      $set: { quantity: data.quantity },
    };
    const result = await Cart.findOneAndUpdate(query, docs, { new: true });

    res.send(result);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.postCustomarInfo = async (req, res) => {
  const { items } = req.body;
  // console.log(items);
  const address = {
    name:items.name,
    phone: items.phone,
    road: items.address.road,
    suburb: items.address.suburb,
    city: items.address.city,
    province: items.address.province,
    state: items.address.state,
    postcode: items.address.postcode,
    country: items.address.country,
    country_code: items.address.country_code,
    customAddress: items.customAddress,
    location: items.location,
  };

  const distence = getDistance(
    { latitude: items.location.lat, longitude: items.location.lng },
    { latitude: process.env.SHOP_LAT, longitude: process.env.SHOP_LNG }
  );
  const distenceKm = (distence / 1000).toFixed(2);

  const cart = await Cart.find({ email: items.email });

  //  orderNo: items.orderNo,
  // payType: items.payment,
  // totalAmount: items.totalAmount,
  //  orders: cart,

  try {
    const result = new ConfirmOrder({
      email: items.email,
      address: address,
      status: "unconfirmed",
      distence: distenceKm,
    });
    await result.save();

    // if (result) {
    //   const delte = await Cart.deleteMany({ email: items.email });
    // }
    console.log(result);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.getDistanceController = async (req, res, next) => {
  const email = req.params.email;

  const cart = await ConfirmOrder.findOne({
    email: email,
    status: "unconfirmed",
  });
  res.status(200).json(cart);
};

// exports.getConfirmOrderController = async(req,res,next) => {
//   const data =await ConfirmOrder.find()
//   res.send(data)
// }
exports.getConfirmOrderController = async (req, res, next) => {
  const data = await ConfirmOrder.find().sort({ _id: -1 });

  res.send(data);

  //   const result = await ConfirmOrder.aggregate([
  //   {
  //     $group: {
  //       _id: {
  //         $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
  //       },
  //       items: { $push: "$$ROOT" }, // all documents of that date
  //       count: { $sum: 1 }          // optional
  //     }
  //   },
  //   { $sort: { _id: 1 } }            // sort by date
  // ]);

  // res.send(result);
};

exports.getConfirmOrderByIdController = async (req, res, next) => {
  const id = req.params.id;
  try {
    const order = await ConfirmOrder.findOne({ _id: id });

    res.send(order);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.confirmOrderController = async (req, res, next) => {
  const email = req.params.email;
  const data = req.body;

  try {
    const cart = await Cart.find({ email:email });
    const query = { email: email, status: "unconfirmed" };
    const docs = {
      $set: {
        status: data.status,
        payType: data.payment,
        orderNo: data.orderNo,
        orders: cart,
        totalAmount: data.totalAmount,
      },
    };
    const result = await ConfirmOrder.findOneAndUpdate(query, docs, {
      new: true,
    });
    const delte = await Cart.deleteMany({ email: email });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.cancelledOrderController = async (req, res, next) => {
  const id = req.params.id;
  const data = req.body;
  try {
    const query = { _id: id };
    const docs = {
      $set: {
        status: data.status,
      },
    };
    const result = await ConfirmOrder.findOneAndUpdate(query, docs, {
      new: true,
    });

    res.send(result);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.updateConfirmOrderStatus = async (req, res, next) => {
  const id = req.params.id;
  const data = req.body;
  try {
    const query = { _id: id };
    const docs = {
      $set: {
        status: data.status,
        totalAmount: data.totalAmount,
      },
    };
    const result = await ConfirmOrder.findOneAndUpdate(query, docs, {
      new: true,
    });

    const date = new Date(result.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    const html = `<!DOCTYPE html>
<html>
  <body style="margin:0; padding:0; background-color:#f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4; padding:20px 0;">
      <tr>
        <td align="center">

       
          <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:6px; overflow:hidden; font-family:Arial, sans-serif;">

           
            <tr>
              <td style="background-color:#0d6efd; padding:20px; text-align:center;">
                <h1 style="color:#ffffff; margin:0; font-size:24px;">
                MOOM24
                </h1>
              </td>
            </tr>

           
            <tr>
              <td style="padding:25px; color:#333333;">
                <h2 style="margin-top:0; font-size:20px;">
                  Order Confirmed 🎉
                </h2>

                <p style="font-size:15px; line-height:22px;">
                  Hi <strong>${result.address.name}</strong>,
                </p>

                <p style="font-size:15px; line-height:22px;">
                  Thank you for your order! Your order has been successfully confirmed.
                </p>

               
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:15px; border:1px solid #dddddd;">
                  <tr>
                    <td style="padding:10px; background-color:#f8f9fa; font-weight:bold;">
                      Order ID
                    </td>
                    <td style="padding:10px;">
                     ${result.orderNo}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:10px; background-color:#f8f9fa; font-weight:bold;">
                      Order Date
                    </td>
                    <td style="padding:10px;">
                      ${date}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:10px; background-color:#f8f9fa; font-weight:bold;">
                      Total Amount
                    </td>
                    <td style="padding:10px;">
                      ${result.totalAmount}
                    </td>
                  </tr>
                </table>

              
                <table cellpadding="0" cellspacing="0" style="margin:25px auto;">
                  <tr>
                    <td align="center" style="background-color:#0d6efd; padding:12px 25px; border-radius:4px;">
                      <a href="http://moom24.com/dashboard/my-orders" style="color:#ffffff; text-decoration:none; font-size:15px; font-weight:bold;">
                        Track Your Order
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="font-size:14px; color:#666666; line-height:20px;">
                  We’ll notify you once your order is shipped.
                </p>
              </td>
            </tr>

           
            <tr>
              <td style="background-color:#f1f1f1; padding:15px; text-align:center; font-size:12px; color:#777777;">
                © 2025 HomeExpress. All rights reserved.
                <br />
                Need help? Contact us at 
                <a href="mailto:admin@moom24.com" style="color:#0d6efd; text-decoration:none;">
                  support@moom24.com
                </a>
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>
  </body>
</html>
`;

    if (result) {
      const updateRider = await User.findOneAndUpdate(
        { email: data.rider },
        { $push: { orders: result._id } },
        { new: true }
      );

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "hmrahimdb@gmail.com",
          pass: "lnrnqbbnahwfmyvb ",
        },
      });
      const mailOptions = {
        from: `"moom24.com" <hmrahimdb@gmail.com>`,
        to: result.email,
        subject: `Order Confirmed! #${result.orderNo}`,
        html: html,
      };
      const send = await transporter.sendMail(mailOptions);
    }

    res.send(result);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.DeleteAllCartController = (req, res, next) => {
  const { id } = req.params.id;
};

exports.getConfirmOrderByEmailController = async (req, res, next) => {
  const email = req.params.email;
  const order = await ConfirmOrder.find({
    email: email,
    status: { $in: ["pending", "confirmed", "delivered"] },
  });
  res.send(order);
};
exports.geAlltConfirmOrderByEmailController = async (req, res, next) => {
  const email = req.params.email;
  const order = await ConfirmOrder.find({ email: email });
  res.send(order);
};

exports.getunConfirmedOrderByEmail = async (req, res, next) => {
  const email = req.params.email;
  try {
    const result = await ConfirmOrder.findOne({
      email: email,
      status: "unconfirmed",
    });

    res.send(result);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ========================promocode controllers ========================
exports.promocodePostController = async (req, res, next) => {
  const data = req.body;
  try {
    const result = new PromoCode({
      code: data.code,
      description: data.description,
      discountType: data.discountType,
      discountValue: data.discountValue,
      minPurchaseAmount: data.minPurchaseAmount,
      maxDiscountAmount: data.maxDiscountAmount,
      usageLimit: data.usageLimit,
      usedCount: data.usedCount,
      startDate: data.startDate,
      endDate: data.endDate,
      isActive: data.isActive,
    });
    await result.save();
    // console.log(result);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.promocodeGetControllers = async (req, res, next) => {
  try {
    const promos = await PromoCode.find().sort({ _id: -1 });
    res.status(200).json(promos);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.getPromoByIdController = async (req, res, next) => {
  const id = req.params.id;
  try {
    const promo = await PromoCode.findById({ _id: id });
    res.status(200).json(promo);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.promoPutController = async (req, res, next) => {
  const id = req.params.id;
  const data = req.body;

  try {
    const query = { _id: id };
    const docs = {
      $set: {
        code: data.code,
        description: data.description,
        discountType: data.discountType,
        discountValue: data.discountValue,
        minPurchaseAmount: data.minPurchaseAmount,
        maxDiscountAmount: data.maxDiscountAmount,
        usageLimit: data.usageLimit,
        usedCount: data.usedCount,
        startDate: data.startDate,
        endDate: data.endDate,
        isActive: data.isActive,
      },
    };

    const result = await PromoCode.findByIdAndUpdate(query, docs, {
      new: true,
    });

    if (!result) {
      return res.status(404).json({ message: "Promocode not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.deletePromo = async (req, res, next) => {
  const id = req.params.id;
  console.log(id);
  try {
    const result = await PromoCode.findOneAndDelete({ _id: id });
    if (!result) {
      res.status(500).json({ message: "Server Error", error: error.message });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
