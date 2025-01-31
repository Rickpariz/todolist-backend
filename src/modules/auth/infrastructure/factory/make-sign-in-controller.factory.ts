import { PrismaClient } from "@prisma/client";
import { Controller } from "../../../../shared/domain/controller";
import UserRepository from "../../../users/infrastructure/database/user.repository";
import SignInUseCase from "../../application/use-cases/sign-in.usecase";
import SignInController from "../http/controllers/sign-in.controller";

export default function MakeSignInController(): Controller {
  const prisma = new PrismaClient();
  const repository = new UserRepository(prisma);
  const usecase = new SignInUseCase(repository);
  return new SignInController(usecase);
}
