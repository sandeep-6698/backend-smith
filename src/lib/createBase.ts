import simpleGit from "simple-git";
import path from 'path';
import fs from 'fs';
import logger from "./logger";
import { runCommandHelper } from "../helper/runCommandHelper";
import { chdir } from 'node:process'

const repo = "https://github.com/sandeep-6698/backend-smith-express"

export const createBase = async (name: string) => {
    try {
        const destination = path.join(process.cwd(), name)
        // Check if the folder already exists
        if (!fs.existsSync(destination)) {
            fs.mkdirSync(destination);
            logger.info(`Created: ${name}`);
        } else {
            logger.warn(`Folder already exists: ${name}`);
            return;
        }
        const git = simpleGit();
        await git.clone(repo, destination);
        logger.info("Application created");
        chdir(destination)
        try {
            logger.info("Installing packages using pnpm...");
            await runCommandHelper(`pnpm install`)
        } catch (error) {
            logger.info("Installing packages using pnpm failed");
            logger.info("Triying with npm...");
            await runCommandHelper(`npm install`)
        }
        logger.info("Ready to use");
    } catch (error) {
        console.log(error)
        logger.error("Faile to setup repo");
    }
}
