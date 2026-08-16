import path from "path";

export const getTemplatePath = () => {
  return path.join(__dirname, "..", "..", "template");
};
