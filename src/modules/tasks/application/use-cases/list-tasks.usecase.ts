import { IUseCase } from "../../../../shared/domain/usecase";
import { Pagination } from "../../../../shared/domain/pagination.interface";
import {
  ListTasksDto,
  listTasksDtoSchema,
} from "../../infrastructure/dtos/list-tasks.dto";
import { Task } from "../../domain/entities/task.entity";
import { ITaskRepository } from "../../domain/repositories/task-repository.interface";
import { Validate } from "../../../../shared/infrastructure/decorators/validation.decorator";
import { DEFAULT_PAGE_SIZE } from "../../../../shared/application/pagination";

export default class ListTasksUseCase
  implements IUseCase<ListTasksDto, Pagination<Task>>
{
  constructor(readonly repository: ITaskRepository) {}

  @Validate(listTasksDtoSchema)
  async execute(data: ListTasksDto): Promise<Pagination<Task>> {
    const { userId, pageSize, pageNumber, orderBy } = data;

    console.log(data);
    const tasks = await this.repository.findAll({
      userId,
      orderBy,
      pagination: {
        pageNumber: Number(pageNumber || 1),
        pageSize: Number(pageSize || DEFAULT_PAGE_SIZE),
      },
    });

    return tasks;
  }
}
