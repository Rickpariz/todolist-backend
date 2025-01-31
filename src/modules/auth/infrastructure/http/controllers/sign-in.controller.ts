import { IUseCase } from "../../../../../shared/domain/usecase";
import {
  Controller,
  HttpResponse,
} from "../../../../../shared/domain/controller";
import { Request } from "express";
import { SignInDto } from "../../dtos/sign-in.dto";
import { AccessToken } from "../../../domain/entities/access-token.entity";
import { Ok } from "../../../../../shared/infrastructure/http/responses";

export default class SignInController implements Controller {
  constructor(readonly usecase: IUseCase<SignInDto, AccessToken>) {}

  async handle(req: Request): Promise<HttpResponse> {
    const user = await this.usecase.execute(req.body);
    return Ok(user);
  }
}
