// nodemailer email পাঠানোর জন্য
import nodemailer from "nodemailer";

// function বানাচ্ছি যাতে যেকোন জায়গা থেকে email পাঠানো যায়
export const sendEmail = async ({ name, email, phone, message }) => {
  // transporter = email পাঠানোর মাধ্যম
  const transporter = nodemailer.createTransport({
    // gmail ব্যবহার করছি
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      ciphers: "SSLv3",
    },
  });

  return await transporter.sendMail({
    from: `"MOOM24.COM" <${email}>`,
    to: "hmrahimdb@gmail.com",

    subject: "📩 New Contact Message",

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
