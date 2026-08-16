import { type Field } from "./parseFieldsHelper";

const scalarTsType: Record<string, string> = {
  String: "string",
  Number: "number",
  Boolean: "boolean",
  Date: "Date",
};

export const isJsonField = (field: Field): boolean => {
  return Array.isArray(field.type) || (typeof field.type === "object" && field.type !== null);
};

export const toTsType = (field: Field): string => {
  if (Array.isArray(field.type)) {
    const item = field.type[0];
    if (typeof item === "string") {
      return field.enum
        ? `Array<"${field.enum.join('" | "')}">`
        : `${scalarTsType[item] ?? "string"}[]`;
    }
    return "Record<string, unknown>[]";
  }
  if (typeof field.type === "object" && field.type !== null) {
    return "Record<string, unknown>";
  }
  if (field.enum) return `"${field.enum.join('" | "')}"`;
  return scalarTsType[field.type as string] ?? "string";
};
