import {
  Controller,
  HttpResponse,
} from "../../../../../shared/domain/controller";
import { IUseCase } from "../../../../../shared/domain/usecase";
import { UpdateUserUseCaseDto } from "../../dtos/update-user.dto";
import { User } from "../../../domain/entities/user.entity";
import { Request } from "express";
import { Ok } from "../../../../../shared/infrastructure/http/responses";

export default class UpdateUserController implements Controller {
  constructor(readonly usecase: IUseCase<UpdateUserUseCaseDto, User>) {}

  async handle(req: Request): Promise<HttpResponse> {
    const { name, email } = req.body;
    const { id } = req.params;
    const tokenUser = req.user;

    const user = await this.usecase.execute({
      id: Number(id),
      name,
      email,
      tokenUser: tokenUser!,
    });

    return Ok(user);
  }
}
