import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { Request } from "express";
import DeleteTaskController from "../delete-task.controller";
import { DeleteTaskDto } from "../../../dtos/delete-task.dto";
import { IUseCase } from "../../../../../../shared/domain/usecase";
import { Ok } from "../../../../../../shared/infrastructure/http/responses";

describe("DeleteTaskController", () => {
  let usecase: IUseCase<DeleteTaskDto, void>;
  let controller: DeleteTaskController;

  beforeEach(() => {
    usecase = {
      execute: vi.fn(),
    };

    controller = new DeleteTaskController(usecase);
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

  it("should return Ok response when task is successfully deleted", async () => {
    const mockRequest = {
      params: { id: "123" },
      user: { id: 456 },
    } as unknown as Request;

    const response = await controller.handle(mockRequest);

    expect(response).toEqual(Ok({ success: true }));
  });

  it("should throw an error if usecase.execute fails", async () => {
    const mockRequest = {
      params: { id: "123" },
      user: { id: 456 },
    } as unknown as Request;

    (usecase.execute as Mock).mockRejectedValue(new Error("Task not found"));

    await expect(controller.handle(mockRequest)).rejects.toThrow(
      "Task not found"
    );
  });
});
