import { isJsonField } from "../helper/fieldTsType";
import { parseFieldsHelper } from "../helper/parseFieldsHelper";
import { toPascalCase } from "../helper/toPascalCase";

export const prismaServiceTemplate = (module: string, fields: string[]): string => {
  const parsedFields = parseFieldsHelper(fields);
  const name = toPascalCase(module);
  const client = `${name.charAt(0).toLowerCase()}${name.slice(1)}`;
  const jsonKeys = Object.entries(parsedFields)
    .filter(([, field]) => isJsonField(field))
    .map(([key]) => key);

  const encodeLines = jsonKeys
    .map((key) => `      ${key}: data.${key} !== undefined ? JSON.stringify(data.${key}) : undefined,`)
    .join("\n");
  const decodeLines = jsonKeys
    .map((key) => `    ${key}: record.${key} ? JSON.parse(record.${key}) : record.${key},`)
    .join("\n");

  return `
import { prisma } from "@common/services/prisma.client";
import { type I${name} } from "./${module}.dto";

const toI${name} = (record: any): I${name} => {
  const { id, ...rest } = record;
  return {
    ...rest,
    _id: id,
${decodeLines}
  } as I${name};
};

export const create${name} = async (
  data: Omit<I${name}, "_id" | "createdAt" | "updatedAt">
) => {
  const result = await prisma.${client}.create({
    data: {
      ...data,
${encodeLines}
    } as any,
  });
  return toI${name}(result);
};

export const update${name} = async (id: string, data: Partial<I${name}>) => {
  const result = await prisma.${client}.update({
    where: { id },
    data: {
      ...data,
${encodeLines}
    } as any,
  });
  return toI${name}(result);
};

export const edit${name} = update${name};

export const delete${name} = async (id: string) => {
  const result = await prisma.${client}.delete({ where: { id } });
  return result;
};

export const get${name}ById = async (id: string) => {
  const result = await prisma.${client}.findUnique({ where: { id } });
  return result ? toI${name}(result) : null;
};

export const getAll${name} = async (options?: { skip?: number; limit?: number }) => {
  const result = await prisma.${client}.findMany({ skip: options?.skip, take: options?.limit });
  return result.map(toI${name});
};

export const count${name} = async () => {
  return await prisma.${client}.count();
};
`;
};
