import { Request } from "express";
import {
  Controller,
  HttpResponse,
} from "../../../../../shared/domain/controller";
import { IUseCase } from "../../../../../shared/domain/usecase";
import { Ok } from "../../../../../shared/infrastructure/http/responses";
import { DeleteTaskDto } from "../../dtos/delete-task.dto";

export default class DeleteTaskController implements Controller {
  constructor(readonly usecase: IUseCase<DeleteTaskDto, void>) {}

  async handle(req: Request): Promise<HttpResponse> {
    const { id } = req.params;
    const tokenUser = req.user;

    await this.usecase.execute({
      id: Number(id),
      userId: tokenUser?.id!,
    });

    return Ok({ success: true });
  }
}
