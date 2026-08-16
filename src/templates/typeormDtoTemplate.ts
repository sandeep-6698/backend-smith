import { toPascalCase } from "../helper/toPascalCase";

export const typeormDtoTemplate = (module: string): string => {
  const name = toPascalCase(module);
  return `
export { type ${name} as I${name} } from "./${module}.entity";
`;
};
