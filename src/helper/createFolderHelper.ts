import fs from 'fs';
import { getAbsolutePath } from "./getAbsolutePath";
import { registerModuleAlias } from "./aliasHelper";
import logger from '../lib/logger';

export const createFolderHeplder = (module: string) => {
    const folderPath = getAbsolutePath(module)

    // Check if the folder already exists
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
        logger.info(`Module created: ${module}`);
        if (registerModuleAlias(process.cwd(), module)) {
            logger.info(`Registered alias @${module} -> app/${module}`);
        }
    } else {
        logger.warn(`Module already exists: ${module}`);
    }
}