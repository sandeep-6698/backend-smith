import { Field, parseFieldsHelper } from "../helper/parseFieldsHelper";
import { toPascalCase } from "../helper/toPascalCase";

// Function to generate validation for a schema recursively
function generateValidations(schema: Record<string, Field>, parentKey = '', required = true) {
    let validationCode = '\n';

    for (const [key, value] of Object.entries(schema)) {
        const fieldKey = parentKey ? `${parentKey}.${key}` : key;
        let validationLine = ` body('${fieldKey}')`;

        if (value.required && required) {
            validationLine += `.notEmpty().withMessage('${fieldKey} is required')`;
        }

        if (Array.isArray(value.type)) {
            const type = value.type[0];

            if (typeof type === 'string') {
                if (type === 'String') {
                    validationLine += `.isString().withMessage('${fieldKey} must be a string')`;
                } else if (type === 'Number') {
                    validationLine += `.isNumeric().withMessage('${fieldKey} must be a number')`;
                } else if (type === 'Boolean') {
                    validationLine += `.isBoolean().withMessage('${fieldKey} must be a boolean')`;
                }
            } else if (typeof type === 'object') {
                // For nested array of objects
                validationCode += generateValidations(type, `${fieldKey}.*`, required);
                continue;
            }
        } else if (typeof value.type === 'string') {
            if (value.type === 'String') {
                validationLine += `.isString().withMessage('${fieldKey} must be a string')`;
            } else if (value.type === 'Number') {
                validationLine += `.isNumeric().withMessage('${fieldKey} must be a number')`;
            } else if (value.type === 'Boolean') {
                validationLine += `.isBoolean().withMessage('${fieldKey} must be a boolean')`;
            }
        } else if (typeof value.type === 'object') {
            // Handle nested objects
            validationCode += generateValidations(value.type, fieldKey, required);
            continue;
        }

        validationCode += validationLine.trim() + `,\n`;
    }

    return validationCode;
}

export const validationTemplate = (module: string, fields: string[]) => {

    const parsedFields = parseFieldsHelper(fields);
    const name = toPascalCase(module);

    return `
    import { body } from 'express-validator';
    
    export const create${name} = [${generateValidations(parsedFields)}];

    export const update${name} = [${generateValidations(parsedFields)}];

    export const edit${name} = [${generateValidations(parsedFields, '', false)}];
    `
}