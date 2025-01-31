import { vi, expect, it, describe, beforeEach } from "vitest";
import { PrismaClient } from "@prisma/client";
import { Controller } from "../../../../../shared/domain/controller";
import MakeSignInController from "../make-sign-in-controller.factory";
import UserRepository from "../../../../users/infrastructure/database/user.repository";
import SignInUseCase from "../../../application/use-cases/sign-in.usecase";
import SignInController from "../../http/controllers/sign-in.controller";

vi.mock("../../../../shared/tests/prisma");

describe("MakeSignInController", () => {
  let controller: Controller;

  beforeEach(() => {
    controller = MakeSignInController();
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

  it("should instantiate SignInUseCase", () => {
    const prismaInstance = new PrismaClient();
    const repository = new UserRepository(prismaInstance);
    const usecase = new SignInUseCase(repository);
    expect(usecase).toBeInstanceOf(SignInUseCase);
  });

  it("should instantiate SignInController", () => {
    const prismaInstance = new PrismaClient();
    const repository = new UserRepository(prismaInstance);
    const usecase = new SignInUseCase(repository);
    const controllerInstance = new SignInController(usecase);
    expect(controllerInstance).toBeInstanceOf(SignInController);
  });

  it("should return an instance of SignInController", () => {
    expect(controller).toBeInstanceOf(SignInController);
  });
});
