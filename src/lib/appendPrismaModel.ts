import fs from "fs";
import path from "path";
import { getRefFields } from "../helper/getRefFields";
import { runCommandHelper } from "../helper/runCommandHelper";
import { toPascalCase } from "../helper/toPascalCase";
import { prismaModelTemplate } from "../templates/prismaModelTemplate";
import logger from "./logger";

const addInverseRelation = (schema: string, refModelName: string, currentModelName: string): string => {
  const inverseFieldName = `${currentModelName.charAt(0).toLowerCase()}${currentModelName.slice(1)}s`;
  const modelRegex = new RegExp(`(model\\s+${refModelName}\\s*{[^}]*)(})`);

  if (new RegExp(`${inverseFieldName}\\s+${currentModelName}\\[\\]`).test(schema)) {
    return schema;
  }

  return schema.replace(modelRegex, (_match, body, closingBrace) => {
    return `${body}  ${inverseFieldName} ${currentModelName}[]\n${closingBrace}`;
  });
};

export const appendPrismaModel = async (module: string, fields: string[]) => {
  const schemaPath = path.join(process.cwd(), "prisma", "schema.prisma");
  if (!fs.existsSync(schemaPath)) {
    logger.warn("prisma/schema.prisma not found, skipping model generation.");
    return;
  }

  const name = toPascalCase(module);
  let schema = fs.readFileSync(schemaPath, "utf-8");
  if (new RegExp(`model\\s+${name}\\s*{`).test(schema)) {
    logger.warn(`Model ${name} already exists in schema.prisma, skipping.`);
    return;
  }

  for (const ref of getRefFields(fields)) {
    const refName = toPascalCase(ref);
    if (new RegExp(`model\\s+${refName}\\s*{`).test(schema)) {
      schema = addInverseRelation(schema, refName, name);
    } else {
      logger.warn(
        `Referenced model "${refName}" not found in prisma/schema.prisma — add it, including a "${module}s ${name}[]" relation field, before running \`prisma generate\`.`
      );
    }
  }

  fs.writeFileSync(schemaPath, `${schema.trimEnd()}\n${prismaModelTemplate(module, fields)}`);
  logger.info(`Added model ${name} to schema.prisma`);

  try {
    await runCommandHelper(`npx prisma generate`);
  } catch (error) {
    logger.warn("Failed to run `prisma generate`, run it manually to refresh @prisma/client types.");
  }
};
