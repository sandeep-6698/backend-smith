import nodemailer from "nodemailer";
import { type MailOptions } from "./mail-options";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: process.env.SMTP_SECURE === "1",
  auth: {
    user: process.env.SMTP_MAIL_USER,
    pass: process.env.SMTP_MAIL_PASS,
  },
});

export const sendMail = async (options: MailOptions): Promise<void> => {
  await transporter.sendMail({
    from: process.env.SMTP_MAIL_USER,
    ...options,
  });
};
