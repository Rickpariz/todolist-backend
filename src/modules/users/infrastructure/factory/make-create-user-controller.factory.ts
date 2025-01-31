import { PrismaClient } from "@prisma/client";
import { Controller } from "../../../../shared/domain/controller";
import UserRepository from "../database/user.repository";
import CreateUserUseCase from "../../application/use-cases/create-user.usecase";
import CreateUserController from "../http/controllers/create-user.controller";

export default function MakeCreateUserController(): Controller {
  const prisma = new PrismaClient();
  const repository = new UserRepository(prisma);
  const usecase = new CreateUserUseCase(repository);
  return new CreateUserController(usecase);
}
