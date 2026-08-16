import { type Field } from "../helper/parseFieldsHelper";

const scalarType: Record<string, { type: string; format?: string }> = {
    String: { type: "string" },
    Number: { type: "number" },
    Boolean: { type: "boolean" },
    Date: { type: "string", format: "date-time" },
};

const propertyYaml = (field: Field, indent: string): string => {
    if (field.ref) {
        return `${indent}type: string\n${indent}description: Reference to ${field.ref} id`;
    }
    if (Array.isArray(field.type)) {
        const item = field.type[0];
        if (typeof item === "string") {
            const meta = scalarType[item] ?? { type: "string" };
            const itemYaml = field.enum
                ? `${indent}  type: string\n${indent}  enum: [${field.enum.join(", ")}]`
                : `${indent}  type: ${meta.type}${meta.format ? `\n${indent}  format: ${meta.format}` : ""}`;
            return `${indent}type: array\n${indent}items:\n${itemYaml}`;
        }
        return `${indent}type: array\n${indent}items:\n${indent}  type: object\n${indent}  properties:\n${objectYaml(item, `${indent}    `)}`;
    }
    if (typeof field.type === "object" && field.type !== null) {
        return `${indent}type: object\n${indent}properties:\n${objectYaml(field.type, `${indent}  `)}`;
    }
    if (field.enum) {
        return `${indent}type: string\n${indent}enum: [${field.enum.join(", ")}]`;
    }
    const meta = scalarType[field.type as string] ?? { type: "string" };
    return `${indent}type: ${meta.type}${meta.format ? `\n${indent}format: ${meta.format}` : ""}`;
};

const objectYaml = (fields: Record<string, Field>, indent: string): string => {
    return Object.entries(fields)
        .map(([key, field]) => `${indent}${field.ref ? `${key}Id` : key}:\n${propertyYaml(field, `${indent}  `)}`)
        .join("\n");
};

const asJsDoc = (yamlLines: string[]): string => {
    return `/**\n${yamlLines.map((line) => ` * ${line}`).join("\n")}\n */`;
};

export const swaggerSchemaTemplate = (pName: string, fields: Record<string, Field>): string => {
    const yaml = [
        "@swagger",
        "components:",
        "  schemas:",
        `    ${pName}:`,
        "      type: object",
        "      properties:",
        objectYaml(fields, "        "),
    ].join("\n");
    return asJsDoc(yaml.split("\n"));
};

type OperationOptions = {
    method: "get" | "post" | "put" | "patch" | "delete";
    path: "" | "/{id}";
    summary: string;
    hasBody: boolean;
    response: "paginated" | "single" | "none";
};

export const swaggerOperationTemplate = (
    pName: string,
    basePath: string,
    hasSchema: boolean,
    options: OperationOptions
): string => {
    const { method, path, summary, hasBody, response } = options;
    const lines: string[] = [
        "@swagger",
        `${basePath}${path}:`,
        `  ${method}:`,
        `    tags: [${pName}]`,
        `    summary: ${summary}`,
    ];

    if (path === "/{id}") {
        lines.push(
            "    parameters:",
            "      - in: path",
            "        name: id",
            "        required: true",
            "        schema:",
            "          type: string"
        );
    }

    if (response === "paginated") {
        lines.push(
            "    parameters:",
            "      - in: query",
            "        name: page",
            "        schema:",
            "          type: integer",
            "          default: 1",
            "      - in: query",
            "        name: limit",
            "        schema:",
            "          type: integer",
            "          default: 20"
        );
    }

    if (hasBody && hasSchema) {
        lines.push(
            "    requestBody:",
            "      required: true",
            "      content:",
            "        application/json:",
            "          schema:",
            `            $ref: '#/components/schemas/${pName}'`
        );
    }

    lines.push("    responses:", "      '200':", "        description: Success");
    if (response !== "none" && hasSchema) {
        lines.push("        content:", "          application/json:", "            schema:");
        if (response === "paginated") {
            lines.push(
                "              type: object",
                "              properties:",
                "                success:",
                "                  type: boolean",
                "                data:",
                "                  type: array",
                "                  items:",
                `                    $ref: '#/components/schemas/${pName}'`,
                "                pagination:",
                "                  type: object",
                "                  properties:",
                "                    page:",
                "                      type: integer",
                "                    limit:",
                "                      type: integer",
                "                    total:",
                "                      type: integer",
                "                    totalPages:",
                "                      type: integer",
                "                    hasNext:",
                "                      type: boolean",
                "                    hasPrev:",
                "                      type: boolean"
            );
        } else {
            lines.push(`              $ref: '#/components/schemas/${pName}'`);
        }
    }

    return asJsDoc(lines);
};
