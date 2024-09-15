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
                    validationLine += `.isArray().withMessage('${fieldKey} must be an array')`;
                    validationLine += `.bail()`;
                    if (value.enum) {
                        validationLine += `.custom((value) => {
                                                if (value.some(item => ["${value.enum.join('", "')}"].includes(item))) {
                                                    throw new Error('Each item in ${fieldKey} must be in [${value.enum.join(', ')}].');
                                                }
                                                return true;
                                            })
                                        `;
                    }
                    else {

                        validationLine += `.custom((value) => {
                                                if (value.some(item => typeof item !== 'string')) {
                                                    throw new Error('Each item in ${fieldKey} must be a string.');
                                                }
                                                return true;
                                            })
                                        `;
                    }
                } else if (type === 'Number') {
                    validationLine += `.isArray().withMessage('${fieldKey} must be an array')`;
                    validationLine += `.bail()`;
                    validationLine += `.custom((value) => {
                                            if (value.some(item => typeof item !== 'number')) {
                                                throw new Error('Each item in ${fieldKey} must be a string.');
                                            }
                                            return true;
                                        })
                                    `;
                } else if (type === 'Boolean') {
                    validationLine += `.isArray().withMessage('${fieldKey} must be an array')`;
                    validationLine += `.custom((value) => {
                                            if (value.some(item => typeof item !== 'boolean')) {
                                                throw new Error('Each item in ${fieldKey} must be a string.');
                                            }
                                            return true;
                                        })
                                    `;
                }
            } else if (typeof type === 'object') {
                // For nested array of objects
                validationCode += generateValidations(type, `${fieldKey}.*`, required);
                continue;
            }
        } else if (typeof value.type === 'string') {
            if (value.type === 'String') {
                validationLine += `.isString().withMessage('${fieldKey} must be a string')`;
                if (value.enum) {
                    validationLine += `.custom((value) => {
                                                if (["${value.enum.join('", "')}"].includes(value)) {
                                                    throw new Error('${fieldKey} must be in [${value.enum.join(', ')}].');
                                                }
                                                return true;
                                            })
                                        `;
                }
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