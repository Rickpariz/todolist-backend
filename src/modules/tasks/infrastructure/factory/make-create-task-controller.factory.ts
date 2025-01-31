import { PrismaClient } from "@prisma/client";
import { Controller } from "../../../../shared/domain/controller";
import TaskRepository from "../database/task.repository";
import CreateTaskUseCase from "../../application/use-cases/create-task.usecase";
import CreateTaskController from "../http/controllers/create-task.controller";

export default function MakeCreateTaskController(): Controller {
  const prisma = new PrismaClient();
  const repository = new TaskRepository(prisma);
  const usecase = new CreateTaskUseCase(repository);
  return new CreateTaskController(usecase);
}
