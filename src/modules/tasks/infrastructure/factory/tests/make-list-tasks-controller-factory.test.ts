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

vi.mock("../../../../shared/tests/prisma");

describe("MakeListTasksController", () => {
  let controller: Controller;

  beforeEach(() => {
    controller = MakeListTasksController();
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

  it("should instantiate ListTasksUseCase", () => {
    const prismaInstance = new PrismaClient();
    const repository = new TaskRepository(prismaInstance);
    const usecase = new ListTasksUseCase(repository);
    expect(usecase).toBeInstanceOf(ListTasksUseCase);
  });

  it("should instantiate ListTasksController", () => {
    const prismaInstance = new PrismaClient();
    const repository = new TaskRepository(prismaInstance);
    const usecase = new ListTasksUseCase(repository);
    const controllerInstance = new ListTasksController(usecase);
    expect(controllerInstance).toBeInstanceOf(ListTasksController);
  });

  it("should return an instance of ListTasksController", () => {
    expect(controller).toBeInstanceOf(ListTasksController);
  });
});
