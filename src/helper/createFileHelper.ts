import path from "path";
import fs from 'fs';
import { getAbsolutePath } from "./getAbsolutePath";
import logger from "../lib/logger";
import { runCommandHelper } from "./runCommandHelper";

export const createFileHepler = (module: string, type: string, content: string) => {
  const folderPath = getAbsolutePath(module)
  const filePath = path.join(folderPath, `${module}.${type}.ts`);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
    logger.info(`Created ${type}`);
    runCommandHelper(`npx prettier . -w`)
  } else {
    logger.warn(`File already exists: ${filePath}`);
  }
}