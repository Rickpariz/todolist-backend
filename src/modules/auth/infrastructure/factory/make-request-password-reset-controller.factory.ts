import { PrismaClient } from "@prisma/client";
import { Controller } from "../../../../shared/domain/controller";
import UserRepository from "../../../users/infrastructure/database/user.repository";
import RequestPasswordResetController from "../http/controllers/request-password-reset.controller";
import RequestPasswordResetUseCase from "../../application/use-cases/request-password-reset.usecase";

export default function MakeRequestPasswordResetController(): Controller {
  const prisma = new PrismaClient();
  const repository = new UserRepository(prisma);
  const usecase = new RequestPasswordResetUseCase(repository);
  return new RequestPasswordResetController(usecase);
}
