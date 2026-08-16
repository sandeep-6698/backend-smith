import { toPascalCase } from "../helper/toPascalCase"

export const serviceTemplate = (module: string) => {
    const name = toPascalCase(module);
    return `
            import {type I${name}} from "./${module}.dto";
            import ${name}Schema from "./${module}.schema";

            export const create${name} = async (data: I${name}) => {
                const result = await ${name}Schema.create({ ...data, active: true });
                return result;
            };

            export const update${name} = async (id: string, data: I${name}) => {
                const result = await ${name}Schema.findOneAndUpdate({ _id: id }, data, {
                    new: true,
                });
                return result;
            };

            export const edit${name} = async (id: string, data: Partial<I${name}>) => {
                const result = await ${name}Schema.findOneAndUpdate({ _id: id }, data);
                return result;
            };

            export const delete${name} = async (id: string) => {
                const result = await ${name}Schema.deleteOne({ _id: id });
                return result;
            };

            export const get${name}ById = async (id: string) => {
                const result = await ${name}Schema.findById(id).lean();
                return result;
            };

            export const getAll${name} = async (options?: { skip?: number; limit?: number }) => {
                const result = await ${name}Schema.find({}, null, options).lean();
                return result;
            };

            export const count${name} = async () => {
                return await ${name}Schema.countDocuments();
            };
`
}