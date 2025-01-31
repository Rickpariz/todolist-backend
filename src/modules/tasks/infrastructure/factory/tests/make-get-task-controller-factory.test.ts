import { vi, expect, it, describe, beforeEach } from "vitest";
import { PrismaClient } from "@prisma/client";
import { Controller } from "../../../../../shared/domain/controller";
import TaskRepository from "../../database/task.repository";
import MakeGetTaskController from "../make-get-task-controller.factory";
import GetTaskUseCase from "../../../application/use-cases/get-task.usecase";
import GetTaskController from "../../http/controllers/get-task.controller";

vi.mock("../../../../shared/tests/prisma");

describe("MakeGetTaskController", () => {
  let controller: Controller;

  beforeEach(() => {
    controller = MakeGetTaskController();
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

  it("should instantiate GetTaskUseCase", () => {
    const prismaInstance = new PrismaClient();
    const repository = new TaskRepository(prismaInstance);
    const usecase = new GetTaskUseCase(repository);
    expect(usecase).toBeInstanceOf(GetTaskUseCase);
  });

  it("should instantiate GetTaskController", () => {
    const prismaInstance = new PrismaClient();
    const repository = new TaskRepository(prismaInstance);
    const usecase = new GetTaskUseCase(repository);
    const controllerInstance = new GetTaskController(usecase);
    expect(controllerInstance).toBeInstanceOf(GetTaskController);
  });

  it("should return an instance of GetTaskController", () => {
    expect(controller).toBeInstanceOf(GetTaskController);
  });
});
