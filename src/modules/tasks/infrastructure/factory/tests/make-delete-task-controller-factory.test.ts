import { vi, expect, it, describe, beforeEach } from "vitest";
import { PrismaClient } from "@prisma/client";
import { Controller } from "../../../../../shared/domain/controller";
import TaskRepository from "../../database/task.repository";
import MakeDeleteTaskController from "../make-delete-task-controller.factory";
import DeleteTaskUseCase from "../../../application/use-cases/delete-task.usecase";
import DeleteTaskController from "../../http/controllers/delete-task.controller";

vi.mock("../../../../shared/tests/prisma");

describe("MakeDeleteTaskController", () => {
  let controller: Controller;

  beforeEach(() => {
    controller = MakeDeleteTaskController();
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

  it("should instantiate DeleteTaskUseCase", () => {
    const prismaInstance = new PrismaClient();
    const repository = new TaskRepository(prismaInstance);
    const usecase = new DeleteTaskUseCase(repository);
    expect(usecase).toBeInstanceOf(DeleteTaskUseCase);
  });

  it("should instantiate DeleteTaskController", () => {
    const prismaInstance = new PrismaClient();
    const repository = new TaskRepository(prismaInstance);
    const usecase = new DeleteTaskUseCase(repository);
    const controllerInstance = new DeleteTaskController(usecase);
    expect(controllerInstance).toBeInstanceOf(DeleteTaskController);
  });

  it("should return an instance of DeleteTaskController", () => {
    expect(controller).toBeInstanceOf(DeleteTaskController);
  });
});
