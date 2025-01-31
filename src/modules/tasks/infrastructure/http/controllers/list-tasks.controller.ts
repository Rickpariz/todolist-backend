import {
  Controller,
  HttpResponse,
} from "../../../../../shared/domain/controller";
import { IUseCase } from "../../../../../shared/domain/usecase";
import { Pagination } from "../../../../../shared/domain/pagination.interface";
import { Request } from "express";
import { Ok } from "../../../../../shared/infrastructure/http/responses";
import { ListTasksDto } from "../../dtos/list-tasks.dto";
import { Task } from "../../../domain/entities/task.entity";

export default class ListTasksController implements Controller {
  constructor(readonly usecase: IUseCase<ListTasksDto, Pagination<Task>>) {}

  async handle(req: Request): Promise<HttpResponse> {
    const query = req.query as unknown as ListTasksDto;
    const result = await this.usecase.execute({
      ...query,
      userId: req.user!.id,
    });
    return Ok(result);
  }
}
