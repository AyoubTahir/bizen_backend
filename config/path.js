import { fileURLToPath } from "url";
import path from "path";

export const pathResolver = (...paths) => {
  return path.join(
    removeLastWord(path.dirname(fileURLToPath(import.meta.url))),
    ...paths
  );
};

function removeLastWord(str) {
  const lastIndexOfSpace = str.lastIndexOf("\\");

  if (lastIndexOfSpace === -1) {
    return str;
  }

  return str.substring(0, lastIndexOfSpace);
}
