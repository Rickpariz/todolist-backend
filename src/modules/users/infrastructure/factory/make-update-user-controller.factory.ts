import { PrismaClient } from "@prisma/client";
import { Controller } from "../../../../shared/domain/controller";
import UserRepository from "../database/user.repository";
import UpdateUserUseCase from "../../application/use-cases/update-user.usecase";
import UpdateUserController from "../http/controllers/update-user.controller";

export default function MakeUpdateUserController(): Controller {
  const prisma = new PrismaClient();
  const repository = new UserRepository(prisma);
  const usecase = new UpdateUserUseCase(repository);
  return new UpdateUserController(usecase);
}
