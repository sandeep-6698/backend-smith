import { createFileHepler } from "../helper/createFileHelper";
import { readProjectConfig } from "../helper/projectConfig";
import { dtoTemplate } from "../templates/dtoTemplate";
import { prismaDtoTemplate } from "../templates/prismaDtoTemplate";
import { typeormDtoTemplate } from "../templates/typeormDtoTemplate";

export const createDto = (module: string, fields: string[]) => {
    const config = readProjectConfig();

    const template =
        config?.orm === "typeorm"
            ? typeormDtoTemplate(module)
            : config?.orm === "prisma"
            ? prismaDtoTemplate(module, fields)
            : dtoTemplate(module, fields);

    createFileHepler(module, 'dto', template)
}
