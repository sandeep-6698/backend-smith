import { Queue } from "bullmq";
import { type MailOptions } from "../email/providers/mail-options";
import { redisConnection } from "./redis.client";

export const emailQueue = new Queue<MailOptions>("email", {
  connection: redisConnection,
});

export const enqueueEmail = async (data: MailOptions): Promise<void> => {
  await emailQueue.add("send-email", data, {
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
  });
};
