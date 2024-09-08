export type Field = { type: string | string[] | Array<Record<string, Field>> | Record<string, Field>, required: boolean }

const possibleFields: Record<string, string> = {
    String: 'string',
    Number: 'number',
    Boolean: 'boolean',
};

const getName = (field: string) => {
    const firstColonIndex = field.indexOf(':');
    const name = field.substring(0, firstColonIndex);
    if (name.charAt(0) === '*') {
        return { name: name.slice(1), required: true }
    }
    return { name, required: false }
}

const getType = (field: string) => {
    const firstColonIndex = field.indexOf(':');
    const value = field.substring(firstColonIndex + 1);

    if (['[', '{'].includes(value.charAt(0))) {
        const fields = value.slice(1, -1);
        if (possibleFields[fields]) {
            return [fields]
        }
        else {
            const result = parseFieldsHelper(fields.split(' '));
            if (value.charAt(0) == '[')
                return [result]
            return result;
        }
    }
    return value
}

export const parseFieldsHelper = (fields: string[]): Record<string, Field> => {
    const result: Record<string, Field> = {};
    fields.forEach(field => {
        const { name, required } = getName(field)
        const type = getType(field);
        result[name] = { type: type, required };
    })
    return result;
}
