import { vi, describe, it, expect, beforeEach } from "vitest";
import GetTaskUseCase from "../get-task.usecase";
import { ITaskRepository } from "../../../domain/repositories/task-repository.interface";
import { GetTaskDto } from "../../../infrastructure/dtos/get-task.dto";
import { Task } from "../../../domain/entities/task.entity";
import { Unauthorized } from "../../../../../shared/infrastructure/http/responses";

describe("GetTaskUseCase", () => {
  let useCase: GetTaskUseCase;
  let mockRepository: ITaskRepository;

  beforeEach(() => {
    mockRepository = {
      findById: vi.fn(),
    } as unknown as ITaskRepository;

    useCase = new GetTaskUseCase(mockRepository);
  });

  it("should return the task if it exists and belongs to the user", async () => {
    const dto: GetTaskDto = {
      id: 1,
      userId: 1,
    };

    const task: Task = {
      id: 1,
      title: "Existing Task",
      userId: 1,
      description: "Test description",
      status: "pending",
      dueDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.spyOn(mockRepository, "findById").mockResolvedValue(task);

    const result = await useCase.execute(dto);

    expect(result).toEqual(task);
    expect(mockRepository.findById).toHaveBeenCalledWith(dto.id);
  });

  it("should throw NotFound if the task does not exist", async () => {
    const dto: GetTaskDto = {
      id: 999,
      userId: 1,
    };

    vi.spyOn(mockRepository, "findById").mockResolvedValue(null);

    await expect(useCase.execute(dto)).rejects.toThrow("task not found");

    expect(mockRepository.findById).toHaveBeenCalledWith(dto.id);
  });

  it("should throw Unauthorized if the task does not belong to the user", async () => {
    const dto: GetTaskDto = {
      id: 2,
      userId: 2,
    };

    const task: Task = {
      id: 2,
      title: "Existing Task",
      userId: 1,
      description: "Test description",
      dueDate: new Date(),
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.spyOn(mockRepository, "findById").mockResolvedValue(task);

    await expect(useCase.execute(dto)).rejects.toThrow(Unauthorized());

    expect(mockRepository.findById).toHaveBeenCalledWith(dto.id);
  });
});
