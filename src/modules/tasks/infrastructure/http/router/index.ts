import { Router } from "express";
import main from "../../../../../shared/infrastructure/http/controllers";
import { authorize } from "../../../../../shared/infrastructure/http/middlewares/auth";
import MakeUpdateTaskController from "../../factory/make-update-task-controller.factory";
import MakeCreateTaskController from "../../factory/make-create-task-controller.factory";
import MakeListTasksController from "../../factory/make-list-tasks-controller.factory";
import MakeGetTaskController from "../../factory/make-get-task-controller.factory";
import MakeDeleteTaskController from "../../factory/make-delete-task-controller.factory";

const tasksRouter = Router();

tasksRouter.get("/", authorize, main(MakeListTasksController()));
tasksRouter.get("/:id", authorize, main(MakeGetTaskController()));
tasksRouter.post("/", authorize, main(MakeCreateTaskController()));
tasksRouter.patch("/:id", authorize, main(MakeUpdateTaskController()));
tasksRouter.delete("/:id", authorize, main(MakeDeleteTaskController()));

export { tasksRouter };
