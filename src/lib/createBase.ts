import fs from "fs";
import { chdir } from "node:process";
import path from "path";
import simpleGit from "simple-git";
import { getTemplatePath } from "../helper/getTemplatePath";
import { runCommandHelper } from "../helper/runCommandHelper";
import { configureProject } from "./configureProject";
import logger from "./logger";

export const createBase = async (name: string) => {
  try {
    const destination = path.join(process.cwd(), name);
    // Check if the folder already exists
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination);
      logger.info(`Created: ${name}`);
    } else {
      logger.warn(`Folder already exists: ${name}`);
      return;
    }
    fs.cpSync(getTemplatePath(), destination, { recursive: true });
    logger.info("Application created");
    chdir(destination);

    const git = simpleGit(destination);
    await git.init();

    await configureProject(destination);

    try {
      logger.info("Installing packages using pnpm...");
      await runCommandHelper(`pnpm install`);
    } catch (error) {
      logger.info("Installing packages using pnpm failed");
      logger.info("Triying with npm...");
      await runCommandHelper(`npm install`);
    }

    if (fs.existsSync(path.join(destination, "prisma/schema.prisma"))) {
      try {
        await runCommandHelper(`npx prisma generate`);
      } catch (error) {
        logger.warn("Failed to run `prisma generate`, run it manually before starting the app.");
      }
    }

    try {
      await runCommandHelper(`npx prettier ${destination} -w`);
    } catch (error) {
      // best-effort formatting pass, safe to ignore failures
    }

    logger.info("Ready to use");
  } catch (error) {
    console.log(error);
    logger.error("Faile to setup repo");
  }
};
