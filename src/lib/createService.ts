import { createFileHepler } from "../helper/createFileHelper";
import { readProjectConfig } from "../helper/projectConfig";
import { prismaServiceTemplate } from "../templates/prismaServiceTemplate";
import { serviceTemplate } from "../templates/serviceTemplate";
import { typeormServiceTemplate } from "../templates/typeormServiceTemplate";

export const createService = (module: string, fields: string[] = []) => {
    const config = readProjectConfig();

    const template =
        config?.orm === "typeorm"
            ? typeormServiceTemplate(module)
            : config?.orm === "prisma"
            ? prismaServiceTemplate(module, fields)
            : serviceTemplate(module);

    createFileHepler(module, 'service', template)
}
