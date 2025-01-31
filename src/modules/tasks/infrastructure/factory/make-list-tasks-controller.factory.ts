import { PrismaClient } from "@prisma/client";
import { Controller } from "../../../../shared/domain/controller";
import TaskRepository from "../database/task.repository";
import ListTasksUseCase from "../../application/use-cases/list-tasks.usecase";
import ListTasksController from "../http/controllers/list-tasks.controller";

export default function MakeListTasksController(): Controller {
  const prisma = new PrismaClient();
  const repository = new TaskRepository(prisma);
  const usecase = new ListTasksUseCase(repository);
  return new ListTasksController(usecase);
}
