import { toTsType } from "../helper/fieldTsType";
import { parseFieldsHelper, type Field } from "../helper/parseFieldsHelper";
import { toKebabCase } from "../helper/toKebabCase";
import { toPascalCase } from "../helper/toPascalCase";

const toColumn = (key: string, field: Field): string => {
  const optional = field.required ? "!" : "?";

  if (field.ref) {
    const refName = toPascalCase(field.ref);
    return `  @Column({ nullable: ${!field.required} })\n  ${key}Id${optional}: string;\n\n  @ManyToOne(() => ${refName})\n  @JoinColumn({ name: "${key}Id" })\n  ${key}?: ${refName};`;
  }

  const tsType = toTsType(field);

  if (Array.isArray(field.type) && typeof field.type[0] !== "string") {
    return `  @Column({ type: "simple-json" })\n  ${key}${optional}: ${tsType};`;
  }
  if (typeof field.type === "object" && field.type !== null) {
    return `  @Column({ type: "simple-json" })\n  ${key}${optional}: ${tsType};`;
  }
  if (Array.isArray(field.type)) {
    return field.enum
      ? `  @Column({ type: "simple-json" })\n  ${key}${optional}: ${tsType};`
      : `  @Column({ type: "simple-array" })\n  ${key}${optional}: ${tsType};`;
  }
  if (field.enum) {
    return `  @Column({ type: "simple-enum", enum: [${field.enum.map((e) => `"${e}"`).join(", ")}] })\n  ${key}${optional}: ${tsType};`;
  }
  return `  @Column({ nullable: ${!field.required} })\n  ${key}${optional}: ${tsType};`;
};

export const entityTemplate = (module: string, fields: string[]): string => {
  const parsedFields = parseFieldsHelper(fields);
  const name = toPascalCase(module);

  const columns = Object.entries(parsedFields)
    .map(([key, field]) => toColumn(key, field))
    .join("\n\n");

  const refFields = Object.values(parsedFields).filter((field) => field.ref);
  const hasRefs = refFields.length > 0;
  const refImports = Array.from(new Set(refFields.map((field) => field.ref as string)))
    .map((ref) => {
      const refName = toPascalCase(ref);
      const refKebab = toKebabCase(ref);
      return `import { ${refName} } from "@${refKebab}/${refKebab}.entity";`;
    })
    .join("\n");

  return `
import {
  Column,
  CreateDateColumn,
  Entity,${hasRefs ? "\n  JoinColumn,\n  ManyToOne," : ""}
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
${hasRefs ? `${refImports}\n` : ""}
@Entity({ name: "${module}" })
export class ${name} {
  @PrimaryGeneratedColumn("uuid")
  _id!: string;

${columns}

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
`;
};
