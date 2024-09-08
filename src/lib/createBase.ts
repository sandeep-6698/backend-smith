import simpleGit from "simple-git";
import path from 'path';
import fs from 'fs';
import logger from "./logger";
import { exec } from 'child_process';

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
        }
        const git = simpleGit();
        await git.clone(repo, destination);
        logger.info("Application created");
        logger.info("Installing packages...");
        exec(`cd ${destination} && pnpm install`, (err: any) => {
            if (err) {
                logger.error(err)
                return;
            }
            logger.info("Ready to use");
        })
    } catch (error) {
        console.log(error)
        logger.error("Faile to setup repo");
    }
}
