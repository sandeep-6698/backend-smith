import { parseFieldsHelper, type Field } from "../helper/parseFieldsHelper"
import { toPascalCase } from "../helper/toPascalCase";


export const schemaTemplate = (module: string, fields: string[]) => {
    const parsedFields = parseFieldsHelper(fields);
    const name = toPascalCase(module)
    const types: string[] = [];

    const toSchema = (fields: Record<string, Field>) => {
        let result: string = '{';
        Object.entries(fields).forEach(([key, field]) => {
            if (typeof field.type === 'string') {
                result += `${key}: { type: ${field.type}, required: ${field.required}},${'\n'}`
            }
            else if (Array.isArray(field.type)) {
                if (typeof field.type[0] === 'string') {
                    result += `${key}: [{ type: ${field.type[0]}, required: ${field.required}}],${'\n'}`
                }
                else {
                    const name = toPascalCase(key)
                    types.push(`I${name}`);
                    result += `${key}: [new Schema<I${name}>(${toSchema(field.type[0])}, { timestamps: false, _id: false })],${'\n'}`
                }
            }
            else if (typeof field.type === 'object' && !Array.isArray(field.type) && field.type != null) {
                const name = toPascalCase(key)
                types.push(`I${name}`);
                result += `${key}: new Schema<I${name}>(${toSchema(field.type)}, { timestamps: false, _id: false }),${'\n'}`
            }
        })
        result += '}'
        return result;
    }


    const schemaString = toSchema(parsedFields);

    return `
        import mongoose from "mongoose";
        import { type I${name} ${types.length ? `,${types.join(', ')} ` : ''} } from "./${module}.dto";
        const Schema = mongoose.Schema;

        const ${name}Schema = new Schema<I${name}>(${schemaString}, { timestamps: true });
    
        export default mongoose.model<I${name}>("${module}", ${name}Schema);
    `
}