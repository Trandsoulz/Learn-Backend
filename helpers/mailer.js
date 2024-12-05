import dotenv from "dotenv";
dotenv.config();

import { createTransport } from "nodemailer";

const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = process.env;

const transporter = createTransport({
  service: "Gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
  //   host: EMAIL_HOST,
  //   port: EMAIL_PORT,
  //   secure: true, // When using gmail, ther're not needed
});

const sendMail = async (mailTo, mailSubject, mailMessage) => {
  transporter.sendMail(
    {
      to: mailTo,
      subject: mailSubject,
      html: mailMessage,
    },
    (err, info) => {
      if (err) return err;

      return info;
    }
  );
};

export default sendMail;
