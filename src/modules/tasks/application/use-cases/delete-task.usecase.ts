import { IUseCase } from "../../../../shared/domain/usecase";
import { Task } from "../../domain/entities/task.entity";
import { ITaskRepository } from "../../domain/repositories/task-repository.interface";
import { Validate } from "../../../../shared/infrastructure/decorators/validation.decorator";
import {
  NotFound,
  Ok,
  Unauthorized,
} from "../../../../shared/infrastructure/http/responses";
import {
  deleteDtoSchema,
  DeleteTaskDto,
} from "../../infrastructure/dtos/delete-task.dto";

export default class DeleteTaskUseCase
  implements IUseCase<DeleteTaskDto, void>
{
  constructor(readonly repository: ITaskRepository) {}

  @Validate(deleteDtoSchema)
  async execute(data: DeleteTaskDto): Promise<void> {
    const { id, userId } = data;

    const task = await this.repository.findById(id);

    if (!task) throw NotFound("task not found");
    if (userId !== task?.userId) throw Unauthorized();

    await this.repository.delete(id);

    return;
  }
}
