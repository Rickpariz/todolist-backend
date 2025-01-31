import { vi, expect, it, describe, beforeEach } from "vitest";
import { PrismaClient } from "@prisma/client";
import { Controller } from "../../../../../shared/domain/controller";
import MakeResetPasswordController from "../make-reset-password-controller.factory";
import UserRepository from "../../../../users/infrastructure/database/user.repository";
import ResetPasswordUsecase from "../../../application/use-cases/reset-password.usecase";
import ResetPasswordController from "../../http/controllers/reset-password.controller";

vi.mock("../../../../shared/tests/prisma");

describe("MakeResetPasswordController", () => {
  let controller: Controller;

  beforeEach(() => {
    controller = MakeResetPasswordController();
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

  it("should instantiate ResetPasswordUsecase", () => {
    const prismaInstance = new PrismaClient();
    const repository = new UserRepository(prismaInstance);
    const usecase = new ResetPasswordUsecase(repository);
    expect(usecase).toBeInstanceOf(ResetPasswordUsecase);
  });

  it("should instantiate ResetPasswordController", () => {
    const prismaInstance = new PrismaClient();
    const repository = new UserRepository(prismaInstance);
    const usecase = new ResetPasswordUsecase(repository);
    const controllerInstance = new ResetPasswordController(usecase);
    expect(controllerInstance).toBeInstanceOf(ResetPasswordController);
  });

  it("should return an instance of ResetPasswordController", () => {
    expect(controller).toBeInstanceOf(ResetPasswordController);
  });
});
