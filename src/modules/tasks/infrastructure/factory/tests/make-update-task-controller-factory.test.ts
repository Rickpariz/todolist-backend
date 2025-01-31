import { vi, expect, it, describe, beforeEach } from "vitest";
import { PrismaClient } from "@prisma/client";
import { Controller } from "../../../../../shared/domain/controller";
import TaskRepository from "../../database/task.repository";
import MakeGetTaskController from "../make-get-task-controller.factory";
import GetTaskUseCase from "../../../application/use-cases/get-task.usecase";
import GetTaskController from "../../http/controllers/get-task.controller";
import MakeListTasksController from "../make-list-tasks-controller.factory";
import ListTasksUseCase from "../../../application/use-cases/list-tasks.usecase";
import ListTasksController from "../../http/controllers/list-tasks.controller";
import MakeUpdateTaskController from "../make-update-task-controller.factory";
import UpdateTaskUseCase from "../../../application/use-cases/update-task.usecase";
import UpdateTaskController from "../../http/controllers/update-task.controller";

vi.mock("../../../../shared/tests/prisma");

describe("MakeUpdateTaskController", () => {
  let controller: Controller;

  beforeEach(() => {
    controller = MakeUpdateTaskController();
  });

  it("should instantiate PrismaClient", () => {
    const prismaInstance = new PrismaClient();
    expect(prismaInstance).toBeInstanceOf(PrismaClient);
  });

  it("should instantiate TaskRepository", () => {
    const prismaInstance = new PrismaClient();
    const repository = new TaskRepository(prismaInstance);
    expect(repository).toBeInstanceOf(TaskRepository);
  });

  it("should instantiate UpdateTaskUseCase", () => {
    const prismaInstance = new PrismaClient();
    const repository = new TaskRepository(prismaInstance);
    const usecase = new UpdateTaskUseCase(repository);
    expect(usecase).toBeInstanceOf(UpdateTaskUseCase);
  });

  it("should instantiate UpdateTaskController", () => {
    const prismaInstance = new PrismaClient();
    const repository = new TaskRepository(prismaInstance);
    const usecase = new UpdateTaskUseCase(repository);
    const controllerInstance = new UpdateTaskController(usecase);
    expect(controllerInstance).toBeInstanceOf(UpdateTaskController);
  });

  it("should return an instance of UpdateTaskController", () => {
    expect(controller).toBeInstanceOf(UpdateTaskController);
  });
});
