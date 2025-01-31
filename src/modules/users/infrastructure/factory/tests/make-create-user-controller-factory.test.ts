import { vi, expect, it, describe, beforeEach } from "vitest";
import { PrismaClient } from "@prisma/client";
import CreateUserController from "../../http/controllers/create-user.controller";
import MakeCreateUserController from "../make-create-user-controller.factory";
import UserRepository from "../../database/user.repository";
import CreateUserUseCase from "../../../application/use-cases/create-user.usecase";
import { Controller } from "../../../../../shared/domain/controller";

vi.mock("../../../../../shared/tests/prisma");

describe("MakeCreateUserController", () => {
  let controller: Controller;

  beforeEach(() => {
    controller = MakeCreateUserController();
  });

  it("should instantiate PrismaClient", () => {
    const prismaInstance = new PrismaClient();
    expect(prismaInstance).toBeInstanceOf(PrismaClient);
  });

  it("should instantiate UserRepository", () => {
    const prismaInstance = new PrismaClient();
    const repository = new UserRepository(prismaInstance);
    expect(repository).toBeInstanceOf(UserRepository);
  });

  it("should instantiate CreateUserUseCase", () => {
    const prismaInstance = new PrismaClient();
    const repository = new UserRepository(prismaInstance);
    const useCase = new CreateUserUseCase(repository);
    expect(useCase).toBeInstanceOf(CreateUserUseCase);
  });

  it("should instantiate CreateUserController", () => {
    const prismaInstance = new PrismaClient();
    const repository = new UserRepository(prismaInstance);
    const useCase = new CreateUserUseCase(repository);
    const controllerInstance = new CreateUserController(useCase);
    expect(controllerInstance).toBeInstanceOf(CreateUserController);
  });

  it("should return an instance of CreateUserController", () => {
    expect(controller).toBeInstanceOf(CreateUserController);
  });
});
