import { vi, describe, it, expect, beforeEach } from "vitest";
import CreateTaskUseCase from "../create-task.usecase";
import { ITaskRepository } from "../../../domain/repositories/task-repository.interface";
import { CreateTaskUseCaseDto } from "../../../infrastructure/dtos/create-task.dto";
import { Task } from "../../../domain/entities/task.entity";

describe("CreateTaskUseCase", () => {
  let useCase: CreateTaskUseCase;
  let mockRepository: ITaskRepository;

  beforeEach(() => {
    mockRepository = {
      exists: vi.fn(),
      create: vi.fn(),
    } as unknown as ITaskRepository;

    useCase = new CreateTaskUseCase(mockRepository);
  });

  it("should create a new task when it does not already exist", async () => {
    const dto: CreateTaskUseCaseDto = {
      title: "Task",
      userId: 1,
      description: "Description",
      dueDate: new Date(Date.now() + 3600000),
      status: "pending",
    };

    const task: Task = {
      id: 1,
      ...dto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.spyOn(mockRepository, "exists").mockResolvedValue(false);
    vi.spyOn(mockRepository, "create").mockResolvedValue(task);

    const result = await useCase.execute(dto);

    expect(result).toEqual(task);
    expect(mockRepository.exists).toHaveBeenCalledWith({
      title: dto.title,
      userId: dto.userId,
    });
    expect(mockRepository.create).toHaveBeenCalledWith(dto);
  });

  it("should throw Conflict if a task with the same title already exists", async () => {
    const dto: CreateTaskUseCaseDto = {
      userId: 1,
      description: "Description",
      title: "Task",
      dueDate: new Date(Date.now() + 3600000),
      status: "pending",
    };

    vi.spyOn(mockRepository, "exists").mockResolvedValue(true);

    await expect(useCase.execute(dto)).rejects.toThrow(
      "Task with this title already exists"
    );

    expect(mockRepository.exists).toHaveBeenCalledWith({
      title: dto.title,
      userId: dto.userId,
    });
    expect(mockRepository.create).not.toHaveBeenCalled();
  });
});
