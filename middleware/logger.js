import { format } from "date-fns";
import { v4 } from "uuid";
import fs from "fs";
import fsPromises from "fs/promises";
import { pathResolver } from "../config/path.js";

export const logEvents = async (message, logFileName) => {
  const dateTime = format(new Date(), "yyyy-MM-dd\tHH:mm:ss");
  const logItem = `${dateTime}\t${v4()}\t${message}\n`;

  try {
    if (!fs.existsSync(pathResolver("/logs"))) {
      await fs.mkdir(pathResolver("/logs"));
    }
    await fsPromises.appendFile(pathResolver("/logs", logFileName), logItem);
  } catch (err) {
    console.log(err);
  }
};

const logger = (req, res, next) => {
  logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, "reqLog.log");
  console.log(`${req.method}\t${req.path}`);
  next();
};

export default logger;
