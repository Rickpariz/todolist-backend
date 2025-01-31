import { PrismaClient } from "@prisma/client";
import { Controller } from "../../../../shared/domain/controller";
import TaskRepository from "../database/task.repository";
import GetTaskUseCase from "../../application/use-cases/get-task.usecase";
import GetTaskController from "../http/controllers/get-task.controller";

export default function MakeGetTaskController(): Controller {
  const prisma = new PrismaClient();
  const repository = new TaskRepository(prisma);
  const usecase = new GetTaskUseCase(repository);
  return new GetTaskController(usecase);
}
