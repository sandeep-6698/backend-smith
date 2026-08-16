import { isJsonField, toTsType } from "../helper/fieldTsType";
import { parseFieldsHelper } from "../helper/parseFieldsHelper";
import { toPascalCase } from "../helper/toPascalCase";

export const prismaDtoTemplate = (module: string, fields: string[]): string => {
  const parsedFields = parseFieldsHelper(fields);
  const name = toPascalCase(module);

  const overriddenFields = Object.entries(parsedFields).filter(
    ([, field]) => isJsonField(field) || field.enum
  );

  const overrides = overriddenFields
    .map(([key, field]) => `  ${key}${field.required ? "" : "?"}: ${toTsType(field)};`)
    .join("\n");

  const omitKeys = ["id", ...overriddenFields.map(([key]) => key)];

  return `
import { type ${name} as Prisma${name} } from "@prisma/client";

export type I${name} = Omit<Prisma${name}, ${omitKeys.map((k) => `"${k}"`).join(" | ")}> & {
  _id: string;
${overrides}
};
`;
};
