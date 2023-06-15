// mailer.js
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: process.env.MAIL_SECURE,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

export const sendMail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.MAIL_FROM,
    to,
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
