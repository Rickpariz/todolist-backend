import { vi, expect, it, describe, beforeEach } from "vitest";
import { PrismaClient } from "@prisma/client";
import UserRepository from "../../database/user.repository";
import { Controller } from "../../../../../shared/domain/controller";
import UpdateUserUseCase from "../../../application/use-cases/update-user.usecase";
import UpdateUserController from "../../http/controllers/update-user.controller";
import MakeUpdateUserController from "../make-update-user-controller.factory";

vi.mock("../../../../../shared/tests/prisma");

describe("MakeUpdateUserController", () => {
  let controller: Controller;

  beforeEach(() => {
    controller = MakeUpdateUserController();
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

  it("should instantiate UpdateUserUseCase", () => {
    const prismaInstance = new PrismaClient();
    const repository = new UserRepository(prismaInstance);
    const usecase = new UpdateUserUseCase(repository);
    expect(usecase).toBeInstanceOf(UpdateUserUseCase);
  });

  it("should instantiate UpdateUserController", () => {
    const prismaInstance = new PrismaClient();
    const repository = new UserRepository(prismaInstance);
    const usecase = new UpdateUserUseCase(repository);
    const controllerInstance = new UpdateUserController(usecase);
    expect(controllerInstance).toBeInstanceOf(UpdateUserController);
  });

  it("should return an instance of UpdateUserController", () => {
    expect(controller).toBeInstanceOf(UpdateUserController);
  });
});
