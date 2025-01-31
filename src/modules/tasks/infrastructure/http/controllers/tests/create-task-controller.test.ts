import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { Request } from "express";
import CreateTaskController from "../create-task.controller";
import { IUseCase } from "../../../../../../shared/domain/usecase";
import { CreateTaskUseCaseDto } from "../../../dtos/create-task.dto";
import { Task } from "../../../../domain/entities/task.entity";
import { Created } from "../../../../../../shared/infrastructure/http/responses";

describe("CreateTaskController", () => {
  let usecase: IUseCase<CreateTaskUseCaseDto, Task>;
  let controller: CreateTaskController;

  beforeEach(() => {
    usecase = {
      execute: vi.fn(),
    };

    controller = new CreateTaskController(usecase);
  });

  it("should call usecase.execute with correct parameters", async () => {
    const mockRequest = {
      body: {
        title: "Task",
        description: "This is a test task",
      },
      user: { id: 456 },
    } as unknown as Request;

    await controller.handle(mockRequest);

    expect(usecase.execute).toHaveBeenCalledWith({
      title: "Task",
      description: "This is a test task",
      userId: 456,
    });
  });

  it("should return Created response with the created task", async () => {
    const mockRequest = {
      body: {
        title: "Task",
        description: "This is a test task",
      },
      user: { id: 456 },
    } as unknown as Request;

    const mockTask: Task = {
      id: 1,
      title: "Task",
      description: "This is a test task",
      userId: 456,
      status: "pending",
      createdAt: new Date(),
      dueDate: new Date(),
      updatedAt: new Date(),
    };

    (usecase.execute as Mock).mockResolvedValue(mockTask);

    const response = await controller.handle(mockRequest);

    expect(response).toEqual(Created(mockTask));
  });

  it("should throw an error if usecase.execute fails", async () => {
    const mockRequest = {
      body: {
        title: "Task",
        description: "This is a test task",
      },
      user: { id: 456 },
    } as unknown as Request;

    (usecase.execute as Mock).mockRejectedValue(
      new Error("Failed to create task")
    );

    await expect(controller.handle(mockRequest)).rejects.toThrow(
      "Failed to create task"
    );
  });
});
