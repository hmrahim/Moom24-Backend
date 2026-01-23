// const sgMail = require("@sendgrid/mail");
import sgMail from "@sendgrid/mail"
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
export const sendEmail = async ({ to, subject, html }) => {
  // transporter = email পাঠানোর মাধ্যম
  //   const transporter = nodemailer.createTransport({
  //     // gmail ব্যবহার করছি
  //     host: "smtp.gmail.com",
  //     port: 465,
  //     secure: true,
  //     service: "gmail",
  //     auth: {
  //       user: process.env.EMAIL_USER,
  //       pass: process.env.EMAIL_PASS,
  //     },
  //     tls: {
  //       ciphers: "SSLv3",
  //     },
  //   });

  //   return await transporter.sendMail({
  //     from: `"MOOM24.COM" <${email}>`,
  //     to: "hmrahimdb@gmail.com",

  //     subject: "📩 New Contact Message",

  //     html: `
  //      
  //     `,
  //   });
try {
  

  const msg = {
    to,
    from:`moom24.com <${process.env.SENDGRID_FROM}>`,
    subject,
    html,
  };

  await sgMail.send(msg);
 
  
} catch (error) {
  
}

};
