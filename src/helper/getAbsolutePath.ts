import path from "path";

export const getAbsolutePath = (module: string) => {
      const folderPath = path.join(process.cwd(), 'app', module);
      return folderPath
}