import { PrismaClient } from "@prisma/client";
import { Controller } from "../../../../shared/domain/controller";
import TaskRepository from "../database/task.repository";
import DeleteTaskUseCase from "../../application/use-cases/delete-task.usecase";
import DeleteTaskController from "../http/controllers/delete-task.controller";

export default function MakeDeleteTaskController(): Controller {
  const prisma = new PrismaClient();
  const repository = new TaskRepository(prisma);
  const usecase = new DeleteTaskUseCase(repository);
  return new DeleteTaskController(usecase);
}
