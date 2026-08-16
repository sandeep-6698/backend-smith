import { Worker } from "bullmq";
import { sendMail } from "../email/providers/active.provider";
import { type MailOptions } from "../email/providers/mail-options";
import logger from "../logger.service";
import { redisConnection } from "./redis.client";

export const initEmailWorker = (): Worker<MailOptions> => {
  const worker = new Worker<MailOptions>(
    "email",
    async (job) => {
      await sendMail(job.data);
    },
    { connection: redisConnection }
  );

  worker.on("completed", (job) => {
    logger.info(`Email job ${job.id} completed`);
  });

  worker.on("failed", (job, err) => {
    logger.error(`Email job ${job?.id} failed: ${err.message}`);
  });

  return worker;
};
