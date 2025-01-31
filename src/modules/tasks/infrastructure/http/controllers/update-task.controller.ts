import { Request } from "express";
import {
  Controller,
  HttpResponse,
} from "../../../../../shared/domain/controller";
import { IUseCase } from "../../../../../shared/domain/usecase";
import { Ok } from "../../../../../shared/infrastructure/http/responses";
import { Task } from "../../../domain/entities/task.entity";
import { UpdateTaskUseCaseDto } from "../../dtos/update-task.dto";

export default class UpdateTaskController implements Controller {
  constructor(readonly usecase: IUseCase<UpdateTaskUseCaseDto, Task>) {}

  async handle(req: Request): Promise<HttpResponse> {
    const body = req.body;
    const { id } = req.params;
    const tokenUser = req.user;

    const task = await this.usecase.execute({
      id: Number(id),
      ...body,
      tokenUser: tokenUser!,
    });

    return Ok(task);
  }
}
