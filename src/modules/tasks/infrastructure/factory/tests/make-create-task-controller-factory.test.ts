import { vi, expect, it, describe, beforeEach } from "vitest";
import { PrismaClient } from "@prisma/client";
import { Controller } from "../../../../../shared/domain/controller";
import MakeCreateTaskController from "../make-create-task-controller.factory";
import TaskRepository from "../../database/task.repository";
import CreateTaskUseCase from "../../../application/use-cases/create-task.usecase";
import CreateTaskController from "../../http/controllers/create-task.controller";

vi.mock("../../../../shared/tests/prisma");

describe("MakeSignInController", () => {
  let controller: Controller;

  beforeEach(() => {
    controller = MakeCreateTaskController();
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

  it("should instantiate CreateTaskUseCase", () => {
    const prismaInstance = new PrismaClient();
    const repository = new TaskRepository(prismaInstance);
    const usecase = new CreateTaskUseCase(repository);
    expect(usecase).toBeInstanceOf(CreateTaskUseCase);
  });

  it("should instantiate CreateTaskController", () => {
    const prismaInstance = new PrismaClient();
    const repository = new TaskRepository(prismaInstance);
    const usecase = new CreateTaskUseCase(repository);
    const controllerInstance = new CreateTaskController(usecase);
    expect(controllerInstance).toBeInstanceOf(CreateTaskController);
  });

  it("should return an instance of CreateTaskController", () => {
    expect(controller).toBeInstanceOf(CreateTaskController);
  });
});
