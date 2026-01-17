const { default: stripe } = require("../stripe");

exports.paymentStripePostController = async (req, res, next) => {
  try {
    const amount = req.body.amount;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100) , // SAR → halala
      currency: "sar", // Saudi Riyal
      payment_method_types: ["card"],
    });
    console.log(paymentIntent);
    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
