import bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";
import express, { type Express, type Request, type Response } from "express";
import helmet from "helmet";
import http from "http";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";

import { loadConfig } from "@common/helper/config.hepler";
loadConfig();

import { swaggerSpec } from "@common/config/swagger.config";
import errorHandler from "@common/middleware/error-handler.middleware";
import { initDB } from "@common/services/database.service";
import logger from "@common/services/logger.service";
import { initPassport } from "@common/services/passport-jwt.service";
import { initEmailWorker } from "@common/services/queue/email.worker";
import routes from "./app/routes";
import { type IUser } from "@user/user.dto";

declare global {
  namespace Express {
    interface User extends Omit<IUser, "password"> {}
    interface Request {
      user?: User;
    }
  }
}

const port = Number(process.env.PORT) ?? 5000;

const app: Express = express();

app.use(helmet());
app.use(compression());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(morgan("dev"));

const initApp = async (): Promise<void> => {
  // init mongodb
  await initDB();

  // passport init
  initPassport();

  // start background job workers
  initEmailWorker();

  // set base path to /api
  app.use("/api", routes);

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.get("/", (req: Request, res: Response) => {
    res.send({ status: "ok" });
  });

  // error handler
  app.use(errorHandler);
  http.createServer(app).listen(port, () => {
    logger.info(`Server is running on port ${port}`);
  });
};

void initApp();
