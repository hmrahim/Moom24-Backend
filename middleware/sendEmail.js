// nodemailer email পাঠানোর জন্য
import nodemailer from "nodemailer";

// function বানাচ্ছি যাতে যেকোন জায়গা থেকে email পাঠানো যায়
export const sendEmail = async ({ name, email, phone, message }) => {
  // transporter = email পাঠানোর মাধ্যম
  const transporter = nodemailer.createTransport({
    // gmail ব্যবহার করছি
    service: "gmail",

    auth: {
      // আপনার gmail
      user: "hmrahimdb@gmail.com",

      // gmail app password
      pass: "lnrnqbbnahwfmyvb",
    },
  });

  // আসল email পাঠানো হচ্ছে এখানে
  return await transporter.sendMail({
    // customer এর email থেকে আসছে
    from: `"MOOM24.COM" <${email}>`,

    // আপনার email এ যাবে
    to: process.env.EMAIL_USER,

    // subject
    subject: "📩 New Contact Message",

    // email body (HTML)
    html: `
     <div style="
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


    `,
  });
};
