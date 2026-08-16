import { parseFieldsHelper } from "./parseFieldsHelper";

export const getRefFields = (fields: string[]): string[] => {
  const parsed = parseFieldsHelper(fields);
  const refs = Object.values(parsed)
    .map((field) => field.ref)
    .filter((ref): ref is string => Boolean(ref));
  return Array.from(new Set(refs));
};
