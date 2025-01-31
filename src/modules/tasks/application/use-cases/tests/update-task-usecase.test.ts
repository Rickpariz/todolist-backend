import { Mocked } from "vitest";
import { ITaskRepository } from "../../../domain/repositories/task-repository.interface";
import UpdateTaskUseCase from "../update-task.usecase";
import { UpdateTaskUseCaseDto } from "../../../infrastructure/dtos/update-task.dto";
import { Task } from "../../../domain/entities/task.entity";
import {
  Conflict,
  NotFound,
  Unauthorized,
} from "../../../../../shared/infrastructure/http/responses";
import { ERRORS } from "../../../../../shared/domain/enums/errors.enum";

describe("UpdateTaskUseCase", () => {
  let updateTaskUseCase: UpdateTaskUseCase;
  let taskRepository: Mocked<ITaskRepository>;

  beforeEach(() => {
    taskRepository = {
      findById: vi.fn(),
      update: vi.fn(),
      isDuplicateTitle: vi.fn(),
    } as unknown as Mocked<ITaskRepository>;

    updateTaskUseCase = new UpdateTaskUseCase(taskRepository);
  });

  it("should update a task successfully", async () => {
    const userId = 1;
    const taskId = 10;
    const updateDto: UpdateTaskUseCaseDto = {
      id: taskId,
      tokenUser: {
        id: userId,
        email: "ricardo.pariz@gmail.com",
        name: "Ricardo Pariz",
      },
      title: "Updated Task",
      description: "Updated Description",
      status: "completed",
    };

    const existingTask: Task = {
      id: taskId,
      title: "Old Task",
      description: "Old Description",
      status: "pending",
      userId,
      dueDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedTask: Task = {
      ...existingTask,
      ...updateDto,
      updatedAt: new Date(),
    };

    taskRepository.findById.mockResolvedValue(existingTask);
    taskRepository.isDuplicateTitle.mockResolvedValue(false);
    taskRepository.update.mockResolvedValue(updatedTask);

    const result = await updateTaskUseCase.execute(updateDto);

    expect(taskRepository.findById).toHaveBeenCalledWith(taskId);
    expect(taskRepository.isDuplicateTitle).toHaveBeenCalledWith({
      id: taskId,
      title: updateDto.title,
      userId,
    });

    const { id, tokenUser, ...dto } = updateDto;
    expect(taskRepository.update).toHaveBeenCalledWith({
      id,
      ...dto,
    });
    expect(result).toEqual(updatedTask);
  });

  it("should throw NotFound if task does not exist", async () => {
    taskRepository.findById.mockResolvedValue(null);

    const updateDto: UpdateTaskUseCaseDto = {
      id: 99,
      tokenUser: {
        id: 1,
        email: "ricardo.pariz@gmail.com",
        name: "Ricardo Pariz",
      },
      title: "Updated Task",
      description: "Updated Description",
      status: "completed",
    };

    await expect(updateTaskUseCase.execute(updateDto)).rejects.toThrow(
      NotFound("task not found")
    );
  });

  it("should throw Validation Error if dueDate is invalid", async () => {
    taskRepository.findById.mockResolvedValue(null);

    const updateDto: UpdateTaskUseCaseDto = {
      id: 99,
      tokenUser: {
        id: 1,
        email: "ricardo.pariz@gmail.com",
        name: "Ricardo Pariz",
      },
      title: "Updated Task",
      description: "Updated Description",
      dueDate: new Date(),
      status: "completed",
    };

    try {
      await updateTaskUseCase.execute(updateDto);
    } catch (err: any) {
      expect(err.message).toBe(ERRORS.VALIDATION_ERROR);
    }
  });

  it("should throw Unauthorized if user is not the owner of the task", async () => {
    const existingTask: Task = {
      id: 10,
      title: "Existing Task",
      description: "Description",
      status: "pending",
      userId: 2,
      dueDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    taskRepository.findById.mockResolvedValue(existingTask);

    const updateDto: UpdateTaskUseCaseDto = {
      id: 10,
      tokenUser: {
        id: 1,
        email: "ricardo.pariz@gmail.com",
        name: "Ricardo Pariz",
      },
      title: "Updated Task",
      description: "Updated Description",
      status: "completed",
    };

    await expect(updateTaskUseCase.execute(updateDto)).rejects.toThrow(
      Unauthorized()
    );
  });

  it("should throw Conflict if title is duplicated", async () => {
    const userId = 1;
    const taskId = 10;

    const existingTask: Task = {
      id: taskId,
      title: "Existing Task",
      description: "Description",
      status: "pending",
      userId,
      dueDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    taskRepository.findById.mockResolvedValue(existingTask);
    taskRepository.isDuplicateTitle.mockResolvedValue(true);

    const updateDto: UpdateTaskUseCaseDto = {
      id: taskId,
      tokenUser: {
        id: userId,
        email: "ricardo.pariz@gmail.com",
        name: "Ricardo Pariz",
      },
      title: "Existing Task",
      description: "Updated Description",
      status: "completed",
    };

    await expect(updateTaskUseCase.execute(updateDto)).rejects.toThrow(
      Conflict("Task with this title already exists")
    );
  });
});
