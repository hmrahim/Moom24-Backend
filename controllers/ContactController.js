const { sendEmail } = require("../middleware/sendEmail");
const Contact = require("../models/Contact");

exports.contactPostController = async (req, res, next) => {
  const { name, email, phone, message } = req.body;
  const templete = `<div style="
      max-width: 650px;
      margin: 20px auto;
      font-family: Arial, sans-serif;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 8px 20px rgba(0,0,0,0.1);
      border: 1px solid #e0e0e0;
    ">
  
      <div style="
        background: linear-gradient(90deg, #4CAF50, #2E7D32);
        color: #ffffff;
        padding: 20px;
        text-align: center;
        font-size: 22px;
        font-weight: bold;
      ">
        moom24.com
      </div>
  
      <div style="padding: 25px; background-color: #ffffff; color: #333333;">
        <h3 style="margin-top:0; color:#2E7D32;">New Message Received</h3>
        <p style="color:#555555; font-size:14px;">
          You have received a new message from your website contact form.
        </p>
  
        <div style="margin-top:20px; line-height:1.6;">
          <p style="margin:5px 0;"><strong>Name:</strong> ${name}</p>
          <p style="margin:5px 0;"><strong>Email:</strong> ${email}</p>
          <p style="margin:5px 0;"><strong>Phone:</strong> ${phone}</p>
        </div>
  
        <div style="
          margin-top:20px;
          padding:15px;
          background-color:#E8F5E9;
          border-left: 5px solid #4CAF50;
          border-radius: 5px;
        ">
          <p style="margin:0; color:#1B5E20; font-size:15px;">${message}</p>
        </div>
      </div>
  
      <div style="
        background: #2E7D32;
        color: #ffffff;
        text-align: center;
        padding: 15px;
        font-size: 13px;
      ">
        © 2026 moom24.com. All Rights Reserved.
      </div>
  
    </div>
  `;
  try {
    // frontend থেকে data আসছে req.body তে

    const result = new Contact({
      name,
      email,
      phone,
      message,
    });
    await result.save();
    if (result) {
      await sendEmail({
        to: "hmrahimdb@gmail.com",
        subject: "New Contact Message",
        html: templete,
      });
    }

    res.status(200).json({
      success: true,
      message: "Message sent successfully",
    });

    // সব ঠিক থাকলে success response
  } catch (error) {
    
    res.status(400).json({
      message: error.message,
    });
  }
};
