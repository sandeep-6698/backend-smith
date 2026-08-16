import sgMail from "@sendgrid/mail";
import { type MailOptions } from "./mail-options";

sgMail.setApiKey(process.env.SENDGRID_API_KEY ?? "");

export const sendMail = async (options: MailOptions): Promise<void> => {
  await sgMail.send({
    from: process.env.SENDGRID_FROM_EMAIL ?? "",
    ...options,
  });
};
