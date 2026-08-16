import fs from "fs";
import path from "path";
import { createFileHepler } from "../helper/createFileHelper";
import { getRefFields } from "../helper/getRefFields";
import { readProjectConfig } from "../helper/projectConfig";
import { toKebabCase } from "../helper/toKebabCase";
import { schemaTemplate } from "../templates/schemaTemplate";
import { appendPrismaModel } from "./appendPrismaModel";
import { createEntity } from "./createEntity";
import logger from "./logger";

const warnMissingRefs = (fields: string[], refFile: (refKebab: string) => string) => {
    for (const ref of getRefFields(fields)) {
        const refKebab = toKebabCase(ref);
        const refPath = path.join(process.cwd(), "app", refKebab, refFile(refKebab));
        if (!fs.existsSync(refPath)) {
            logger.warn(
                `Referenced module "${ref}" not found at app/${refKebab}/${refFile(refKebab)} — create it before running the app.`
            );
        }
    }
};

export const createSchema = async (module: string, fields: string[]) => {
    const config = readProjectConfig();

    if (config?.orm === "typeorm") {
        warnMissingRefs(fields, (refKebab) => `${refKebab}.entity.ts`);
        createEntity(module, fields);
        return;
    }

    if (config?.orm === "prisma") {
        await appendPrismaModel(module, fields);
        return;
    }

    warnMissingRefs(fields, (refKebab) => `${refKebab}.schema.ts`);
    const template = schemaTemplate(module, fields)
    createFileHepler(module, 'schema', template)
}
