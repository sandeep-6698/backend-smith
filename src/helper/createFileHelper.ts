import path from "path";
import fs from 'fs';
import { getAbsolutePath } from "./getAbsolutePath";
import logger from "../lib/logger";

export const createFileHepler = (module: string, type: string, content: string) => {
  const folderPath = getAbsolutePath(module)
  const filePath = path.join(folderPath, `${module}.${type}.ts`);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
    logger.info(`Created ${type}`);
  } else {
    logger.warn(`File already exists: ${filePath}`);
  }
}