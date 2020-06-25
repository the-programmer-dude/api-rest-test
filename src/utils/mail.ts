import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

interface mailOptions {
  to: string;
  subject: string;
  text: string;
}

function generateConfiguration(options: mailOptions): any {
  const mailConfig: any = {
    from: "ulissescarvalho.d@gmail.com",
    to: options.to,
    subject: options.subject,
    text: options.text,
  };

  const transporterConfig: any = {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  };

  return {
    transporterConfig,
    mailConfig,
  };
}

export default async function sendMail(options: mailOptions) {
  const mailConfiguration = generateConfiguration(options);

  const transporter = nodemailer.createTransport(
    mailConfiguration.transporterConfig
  );

  await transporter.sendMail(mailConfiguration.mailConfig);
}
