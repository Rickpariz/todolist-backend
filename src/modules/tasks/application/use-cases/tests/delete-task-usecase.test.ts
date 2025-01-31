import { vi, describe, it, expect, beforeEach } from "vitest";
import DeleteTaskUseCase from "../delete-task.usecase";
import { ITaskRepository } from "../../../domain/repositories/task-repository.interface";
import { Task } from "../../../domain/entities/task.entity";
import { DeleteTaskDto } from "../../../infrastructure/dtos/delete-task.dto";
import { Unauthorized } from "../../../../../shared/infrastructure/http/responses";

describe("DeleteTaskUseCase", () => {
  let useCase: DeleteTaskUseCase;
  let mockRepository: ITaskRepository;

  beforeEach(() => {
    mockRepository = {
      findById: vi.fn(),
      delete: vi.fn(),
    } as unknown as ITaskRepository;

    useCase = new DeleteTaskUseCase(mockRepository);
  });

  it("should delete a task when found and userId matches", async () => {
    const task: Task = {
      id: 1,
      userId: 1,
      title: "Task",
      description: "Description",
      status: "pending",
      dueDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const dto: DeleteTaskDto = { id: 1, userId: 1 };

    vi.spyOn(mockRepository, "findById").mockResolvedValue(task);
    vi.spyOn(mockRepository, "delete").mockResolvedValue();

    await expect(useCase.execute(dto)).resolves.toBeUndefined();

    expect(mockRepository.findById).toHaveBeenCalledWith(1);
    expect(mockRepository.delete).toHaveBeenCalledWith(1);
  });

  it("should throw NotFound if task does not exist", async () => {
    const dto: DeleteTaskDto = { id: 1, userId: 1 };

    vi.spyOn(mockRepository, "findById").mockResolvedValue(null);

    await expect(useCase.execute(dto)).rejects.toThrow("task not found");

    expect(mockRepository.findById).toHaveBeenCalledWith(1);
    expect(mockRepository.delete).not.toHaveBeenCalled();
  });

  it("should throw Unauthorized if userId does not match", async () => {
    const task: Task = {
      id: 1,
      userId: 1,
      title: "Task",
      description: "Description",
      status: "pending",
      dueDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const dto: DeleteTaskDto = { id: 1, userId: 2 };

    vi.spyOn(mockRepository, "findById").mockResolvedValue(task);

    await expect(useCase.execute(dto)).rejects.toThrow(Unauthorized());

    expect(mockRepository.findById).toHaveBeenCalledWith(1);
    expect(mockRepository.delete).not.toHaveBeenCalled();
  });
});
