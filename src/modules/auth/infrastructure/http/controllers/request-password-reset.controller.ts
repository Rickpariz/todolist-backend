import { IUseCase } from "../../../../../shared/domain/usecase";
import {
  Controller,
  HttpResponse,
} from "../../../../../shared/domain/controller";
import { Request } from "express";
import { AccessToken } from "../../../domain/entities/access-token.entity";
import { RequestPasswordResetDto } from "../../dtos/request-password-reset.dto";
import { Ok } from "../../../../../shared/infrastructure/http/responses";

export default class RequestPasswordResetController implements Controller {
  constructor(
    readonly usecase: IUseCase<RequestPasswordResetDto, AccessToken>
  ) {}

  async handle(req: Request): Promise<HttpResponse> {
    const user = await this.usecase.execute(req.body);
    return Ok(user);
  }
}
