import { IUseCase } from "../../../../shared/domain/usecase";
import { Validate } from "../../../../shared/infrastructure/decorators/validation.decorator";
import {
  Conflict,
  NotFound,
  Unauthorized,
} from "../../../../shared/infrastructure/http/responses";
import { Task } from "../../domain/entities/task.entity";
import { ITaskRepository } from "../../domain/repositories/task-repository.interface";
import {
  updateTaskDtoSchema,
  UpdateTaskUseCaseDto,
} from "../../infrastructure/dtos/update-task.dto";

export default class UpdateTaskUseCase
  implements IUseCase<UpdateTaskUseCaseDto, Task>
{
  constructor(readonly repository: ITaskRepository) {}

  @Validate(updateTaskDtoSchema)
  async execute(data: UpdateTaskUseCaseDto): Promise<Task> {
    const { id, tokenUser, ...dto } = data;

    const exists = await this.repository.findById(id);

    if (!exists) throw NotFound("task not found");

    if (exists.userId !== tokenUser.id) throw Unauthorized();

    if (dto.title) {
      await this.validateDuplicatedTitle({
        id,
        title: dto.title,
        userId: tokenUser.id,
      });
    }

    const user = await this.repository.update({
      id,
      ...dto,
    });

    return user;
  }

  async validateDuplicatedTitle(data: {
    id: number;
    title: string;
    userId: number;
  }) {
    const { id, title, userId } = data;

    const isDuplicated = await this.repository.isDuplicateTitle({
      id,
      title,
      userId,
    });

    if (isDuplicated) {
      throw Conflict("Task with this title already exists");
    }
  }
}
