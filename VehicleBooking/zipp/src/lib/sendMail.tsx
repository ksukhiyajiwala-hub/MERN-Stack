import nodemailer from "nodemailer";

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

export const sendMail = async (to: string, subject: string, html: string) => {
  const info = await transporter.sendMail({
    from: `"ZIPP" <${process.env.EMAIL}>`, // sender address
    to, // list of recipients
    subject, // subject line // plain text body
    html, // HTML body
  });

  console.log("Message sent: %s", info.messageId);
  // Preview URL is only available when using an Ethereal test account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};
