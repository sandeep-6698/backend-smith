/// <reference path="../../../types/mailchimp-transactional.d.ts" />
import createMailchimpClient from "@mailchimp/mailchimp_transactional";
import { type MailOptions } from "./mail-options";

const mailchimp = createMailchimpClient(process.env.MAILCHIMP_API_KEY ?? "");

export const sendMail = async (options: MailOptions): Promise<void> => {
  await mailchimp.messages.send({
    message: {
      from_email: process.env.MAILCHIMP_FROM_EMAIL ?? "",
      subject: options.subject,
      html: options.html,
      to: [{ email: options.to, type: "to" }],
    },
  });
};
