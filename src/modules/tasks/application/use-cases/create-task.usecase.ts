import { IUseCase } from "../../../../shared/domain/usecase";
import { Validate } from "../../../../shared/infrastructure/decorators/validation.decorator";
import { Conflict } from "../../../../shared/infrastructure/http/responses";
import {
  createTaskDtoSchema,
  CreateTaskUseCaseDto,
} from "../../infrastructure/dtos/create-task.dto";
import { Task } from "../../domain/entities/task.entity";
import { ITaskRepository } from "../../domain/repositories/task-repository.interface";

export default class CreateTaskUseCase
  implements IUseCase<CreateTaskUseCaseDto, Task>
{
  constructor(readonly repository: ITaskRepository) {}

  @Validate(createTaskDtoSchema)
  async execute(data: CreateTaskUseCaseDto): Promise<Task> {
    const { title, userId } = data;

    const exists = await this.repository.exists({ title, userId });

    if (exists) {
      throw Conflict("Task with this title already exists");
    }

    const task = await this.repository.create(data);
    return task;
  }
}
