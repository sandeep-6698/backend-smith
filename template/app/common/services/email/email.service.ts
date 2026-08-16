import ejs from "ejs";
import path from "path";
import logger from "../logger.service";
import { enqueueEmail } from "../queue/email.queue";
import { type MailOptions } from "./providers/mail-options";

export const renderTemplate = async (
  template: string,
  data: Record<string, unknown> = {}
): Promise<string> => {
  const templatePath = path.join(
    process.cwd(),
    "app/common/views/emails",
    `${template}.ejs`
  );
  return await ejs.renderFile(templatePath, data);
};

export const sendEmail = async (mailOptions: MailOptions): Promise<void> => {
  try {
    await enqueueEmail(mailOptions);
  } catch (error) {
    logger.error(error);
  }
};
