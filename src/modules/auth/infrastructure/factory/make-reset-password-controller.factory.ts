import { PrismaClient } from "@prisma/client";
import { Controller } from "../../../../shared/domain/controller";
import UserRepository from "../../../users/infrastructure/database/user.repository";
import ResetPasswordController from "../http/controllers/reset-password.controller";
import ResetPasswordUsecase from "../../application/use-cases/reset-password.usecase";

export default function MakeResetPasswordController(): Controller {
  const prisma = new PrismaClient();
  const repository = new UserRepository(prisma);
  const usecase = new ResetPasswordUsecase(repository);
  return new ResetPasswordController(usecase);
}
