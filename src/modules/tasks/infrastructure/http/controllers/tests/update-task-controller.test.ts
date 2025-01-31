import { describe, it, expect, vi, beforeEach } from "vitest";
import { Request } from "express";
import UpdateTaskController from "../update-task.controller";
import { IUseCase } from "../../../../../../shared/domain/usecase";
import { UpdateTaskUseCaseDto } from "../../../dtos/update-task.dto";
import { Task } from "../../../../domain/entities/task.entity";
import { Ok } from "../../../../../../shared/infrastructure/http/responses";

describe("UpdateTaskController", () => {
  let usecase: IUseCase<UpdateTaskUseCaseDto, Task>;
  let controller: UpdateTaskController;

  beforeEach(() => {
    usecase = {
      execute: vi.fn(),
    };

    controller = new UpdateTaskController(usecase);
  });

  it("should call usecase.execute with correct parameters", async () => {
    const mockRequest = {
      body: { title: "Updated Task", description: "Updated Desc" },
      params: { id: "1" },
      user: { id: 123 },
    } as unknown as Request;

    await controller.handle(mockRequest);

    expect(usecase.execute).toHaveBeenCalledWith({
      id: 1,
      title: "Updated Task",
      description: "Updated Desc",
      tokenUser: { id: 123 },
    });
  });

  it("should return Ok response with updated task", async () => {
    const mockRequest = {
      body: { title: "Updated Task", description: "Updated Desc" },
      params: { id: "1" },
      user: { id: 123 },
    } as unknown as Request;

    const updatedTask: Task = {
      id: 1,
      title: "Updated Task",
      description: "Updated Desc",
      userId: 123,
      status: "completed",
      dueDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (usecase.execute as any).mockResolvedValue(updatedTask);

    const response = await controller.handle(mockRequest);

    expect(response).toEqual(Ok(updatedTask));
  });

  it("should throw an error if usecase.execute fails", async () => {
    const mockRequest = {
      body: { title: "Updated Task", description: "Updated Desc" },
      params: { id: "1" },
      user: { id: 123 },
    } as unknown as Request;

    (usecase.execute as any).mockRejectedValue(
      new Error("Failed to update task")
    );

    await expect(controller.handle(mockRequest)).rejects.toThrow(
      "Failed to update task"
    );
  });
});
