import fs from 'fs';
import { getAbsolutePath } from "./getAbsolutePath";
import logger from '../lib/logger';

export const createFolderHeplder = (module: string) => {
    const folderPath = getAbsolutePath(module)

    // Check if the folder already exists
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
        logger.info(`Module created: ${module}`);
    } else {
        logger.warn(`Module already exists: ${module}`);
    }
}