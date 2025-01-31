import { IUseCase } from "../../../../shared/domain/usecase";
import { Task } from "../../domain/entities/task.entity";
import { ITaskRepository } from "../../domain/repositories/task-repository.interface";
import { Validate } from "../../../../shared/infrastructure/decorators/validation.decorator";
import {
  GetTaskDto,
  getTaskDtoSchema,
} from "../../infrastructure/dtos/get-task.dto";
import {
  NotFound,
  Unauthorized,
} from "../../../../shared/infrastructure/http/responses";

export default class GetTaskUseCase implements IUseCase<GetTaskDto, Task> {
  constructor(readonly repository: ITaskRepository) {}

  @Validate(getTaskDtoSchema)
  async execute(data: GetTaskDto): Promise<Task> {
    const { id, userId } = data;

    const task = await this.repository.findById(id);

    if (!task) throw NotFound("task not found");
    if (userId !== task?.userId) throw Unauthorized();

    return task;
  }
}
