import { isJsonField } from "../helper/fieldTsType";
import { parseFieldsHelper, type Field } from "../helper/parseFieldsHelper";
import { toPascalCase } from "../helper/toPascalCase";

const scalarPrismaType: Record<string, string> = {
  String: "String",
  Number: "Float",
  Boolean: "Boolean",
  Date: "DateTime",
};

const toPrismaFieldType = (field: Field): string => {
  if (isJsonField(field) || field.enum) {
    return field.required ? "String" : "String?";
  }
  const base = scalarPrismaType[field.type as string] ?? "String";
  return field.required ? base : `${base}?`;
};

export const prismaModelTemplate = (module: string, fields: string[]): string => {
  const parsedFields = parseFieldsHelper(fields);
  const name = toPascalCase(module);

  const lines = Object.entries(parsedFields)
    .map(([key, field]) => {
      if (field.ref) {
        const refName = toPascalCase(field.ref);
        const optional = field.required ? "" : "?";
        return `  ${key}Id ${field.required ? "String" : "String?"}\n  ${key} ${refName}${optional} @relation(fields: [${key}Id], references: [id])`;
      }
      return `  ${key} ${toPrismaFieldType(field)}`;
    })
    .join("\n");

  return `
model ${name} {
  id        String   @id @default(uuid())
${lines}
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("${module}")
}
`;
};
