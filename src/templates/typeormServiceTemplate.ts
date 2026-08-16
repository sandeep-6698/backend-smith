import { toPascalCase } from "../helper/toPascalCase";

export const typeormServiceTemplate = (module: string): string => {
  const name = toPascalCase(module);
  const repo = `${name.charAt(0).toLowerCase()}${name.slice(1)}Repository`;

  return `
import { type FindOptionsWhere } from "typeorm";
import { AppDataSource } from "@common/services/data-source";
import { ${name} } from "./${module}.entity";

const ${repo} = () => AppDataSource.getRepository(${name});

export const create${name} = async (data: Partial<${name}>) => {
  const entity = ${repo}().create(data);
  const result = await ${repo}().save(entity);
  return result;
};

export const update${name} = async (id: string, data: Partial<${name}>) => {
  await ${repo}().update({ _id: id } as FindOptionsWhere<${name}>, data as any);
  return await get${name}ById(id);
};

export const edit${name} = async (id: string, data: Partial<${name}>) => {
  await ${repo}().update({ _id: id } as FindOptionsWhere<${name}>, data as any);
  return await get${name}ById(id);
};

export const delete${name} = async (id: string) => {
  const result = await ${repo}().delete({ _id: id } as FindOptionsWhere<${name}>);
  return result;
};

export const get${name}ById = async (id: string) => {
  const result = await ${repo}().findOne({
    where: { _id: id } as FindOptionsWhere<${name}>,
  });
  return result;
};

export const getAll${name} = async (options?: { skip?: number; limit?: number }) => {
  const result = await ${repo}().find({ skip: options?.skip, take: options?.limit });
  return result;
};

export const count${name} = async () => {
  return await ${repo}().count();
};
`;
};
