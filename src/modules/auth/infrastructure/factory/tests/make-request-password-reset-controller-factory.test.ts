import { vi, expect, it, describe, beforeEach } from "vitest";
import { PrismaClient } from "@prisma/client";
import { Controller } from "../../../../../shared/domain/controller";
import MakeRequestPasswordResetController from "../make-request-password-reset-controller.factory";
import UserRepository from "../../../../users/infrastructure/database/user.repository";
import RequestPasswordResetUseCase from "../../../application/use-cases/request-password-reset.usecase";
import RequestPasswordResetController from "../../http/controllers/request-password-reset.controller";

vi.mock("../../../../shared/tests/prisma");

describe("MakeRequestPasswordResetController", () => {
  let controller: Controller;

  beforeEach(() => {
    controller = MakeRequestPasswordResetController();
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

  it("should instantiate RequestPasswordResetUseCase", () => {
    const prismaInstance = new PrismaClient();
    const repository = new UserRepository(prismaInstance);
    const useCase = new RequestPasswordResetUseCase(repository);
    expect(useCase).toBeInstanceOf(RequestPasswordResetUseCase);
  });

  it("should instantiate RequestPasswordResetController", () => {
    const prismaInstance = new PrismaClient();
    const repository = new UserRepository(prismaInstance);
    const useCase = new RequestPasswordResetUseCase(repository);
    const controllerInstance = new RequestPasswordResetController(useCase);
    expect(controllerInstance).toBeInstanceOf(RequestPasswordResetController);
  });

  it("should return an instance of RequestPasswordResetController", () => {
    expect(controller).toBeInstanceOf(RequestPasswordResetController);
  });
});
