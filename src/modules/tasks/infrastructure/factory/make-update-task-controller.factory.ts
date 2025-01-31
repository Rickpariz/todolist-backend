import { PrismaClient } from "@prisma/client";
import { Controller } from "../../../../shared/domain/controller";
import TaskRepository from "../database/task.repository";
import UpdateTaskController from "../http/controllers/update-task.controller";
import UpdateTaskUseCase from "../../application/use-cases/update-task.usecase";

export default function MakeUpdateTaskController(): Controller {
  const prisma = new PrismaClient();
  const repository = new TaskRepository(prisma);
  const usecase = new UpdateTaskUseCase(repository);
  return new UpdateTaskController(usecase);
}
