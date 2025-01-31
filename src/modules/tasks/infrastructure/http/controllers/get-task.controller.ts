import { Request } from "express";
import {
  Controller,
  HttpResponse,
} from "../../../../../shared/domain/controller";
import { IUseCase } from "../../../../../shared/domain/usecase";
import { Ok } from "../../../../../shared/infrastructure/http/responses";
import { Task } from "../../../domain/entities/task.entity";
import { GetTaskDto } from "../../dtos/get-task.dto";

export default class GetTaskController implements Controller {
  constructor(readonly usecase: IUseCase<GetTaskDto, Task>) {}

  async handle(req: Request): Promise<HttpResponse> {
    const { id } = req.params;
    const tokenUser = req.user;

    const task = await this.usecase.execute({
      id: Number(id),
      userId: tokenUser?.id!,
    });

    return Ok(task);
  }
}
