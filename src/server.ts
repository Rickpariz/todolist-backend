import "dotenv/config";
import express from "express";
import cors from "cors";
import logger from "./shared/infrastructure/logger";
import swagger from "swagger-ui-express";
import swaggerFile from "../swagger.json";
import { usersRouter } from "./modules/users/infrastructure/http/router";
import { authRouter } from "./modules/auth/infrastructure/http/router";
import { tasksRouter } from "./modules/tasks/infrastructure/http/router";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/docs", swagger.serve, swagger.setup(swaggerFile));

async function createRouter() {
  app.use("/", authRouter);
  app.use("/users", usersRouter);
  app.use("/tasks", tasksRouter);
}

createRouter();

app.listen(process.env.API_PORT, async () => {
  logger.info(`Server Running on port ${process.env.API_PORT}`);
});
