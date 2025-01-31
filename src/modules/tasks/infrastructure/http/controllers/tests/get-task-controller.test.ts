import { describe, it, expect, vi, beforeEach } from "vitest";
import { Request } from "express";
import GetTaskController from "../get-task.controller";
import { IUseCase } from "../../../../../../shared/domain/usecase";
import { GetTaskDto } from "../../../dtos/get-task.dto";
import { Task } from "../../../../domain/entities/task.entity";
import { Ok } from "../../../../../../shared/infrastructure/http/responses";

describe("GetTaskController", () => {
  let usecase: IUseCase<GetTaskDto, Task>;
  let controller: GetTaskController;

  beforeEach(() => {
    usecase = {
      execute: vi.fn(),
    };

    controller = new GetTaskController(usecase);
  });

  it("should call usecase.execute with correct parameters", async () => {
    const mockRequest = {
      params: { id: "123" },
      user: { id: 456 },
    } as unknown as Request;

    await controller.handle(mockRequest);

    expect(usecase.execute).toHaveBeenCalledWith({
      id: 123,
      userId: 456,
    });
  });

  it("should return Ok response with the found task", async () => {
    const mockRequest = {
      params: { id: "123" },
      user: { id: 456 },
    } as unknown as Request;

    const mockTask: Task = {
      id: 123,
      title: "Test Task",
      description: "This is a test task",
      userId: 456,
      status: "pending",
      dueDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (usecase.execute as any).mockResolvedValue(mockTask);

    const response = await controller.handle(mockRequest);

    expect(response).toEqual(Ok(mockTask));
  });

  it("should throw an error if usecase.execute fails", async () => {
    const mockRequest = {
      params: { id: "123" },
      user: { id: 456 },
    } as unknown as Request;

    (usecase.execute as any).mockRejectedValue(new Error("Task not found"));

    await expect(controller.handle(mockRequest)).rejects.toThrow(
      "Task not found"
    );
  });
});
