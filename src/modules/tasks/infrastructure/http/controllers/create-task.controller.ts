import { Request } from "express";
import {
  Controller,
  HttpResponse,
} from "../../../../../shared/domain/controller";
import { IUseCase } from "../../../../../shared/domain/usecase";
import { Created } from "../../../../../shared/infrastructure/http/responses";
import { CreateTaskUseCaseDto } from "../../dtos/create-task.dto";
import { Task } from "../../../domain/entities/task.entity";

export default class CreateTaskController implements Controller {
  constructor(readonly usecase: IUseCase<CreateTaskUseCaseDto, Task>) {}

  async handle(req: Request): Promise<HttpResponse> {
    const task = await this.usecase.execute({
      ...req.body,
      userId: req.user?.id!,
    });

    return Created(task);
  }
}
