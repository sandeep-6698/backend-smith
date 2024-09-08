import { parseFieldsHelper } from "../helper/parseFieldsHelper";
import { toPascalCase } from "../helper/toPascalCase"

const toTypes = (fields: Record<string, any>) => {
    return `${Object.entries(fields).map(([key, value]) => {
        const { type, required } = value;
        const isArray = Array.isArray(type)
        const parsedType = typeof type == 'string' ? type.toLowerCase() : isArray && typeof type[0] == 'string' ? `${type[0].toLowerCase()}` : `I${toPascalCase(key)}`
        return `${key}${required ? '' : '?'}: ${parsedType}${isArray ? '[]': ''}`
    }).join(';\n')}`
}

export const dtoTemplate = (module: string, fields: string[]) => {
    const name = toPascalCase(module);
    const parsedFields = parseFieldsHelper(fields);

    const getNestedTypes = () => {
        const types: string[] = [];
        Object.entries(parsedFields).forEach(([field, { type }]) => {
            if (Array.isArray(type) && typeof type[0] !== 'string') {
                const name = toPascalCase(field);
                types.push(`
                    export interface I${name} {
                        ${toTypes(type[0])}
                    }
                `)
            }
            else if(typeof type === 'object' && !Array.isArray(type)) {
                const name = toPascalCase(field);
                types.push(`
                    export interface I${name} {
                        ${toTypes(type as Record<string, any>)}
                    }
                `)
            }
        })
        return types
    }

    return `
        import { type BaseSchema } from "../common/dto/base.dto";
        
        ${getNestedTypes().join('\n')}

        export interface I${name} extends BaseSchema {
            ${toTypes(parsedFields)}
        }
    `
}