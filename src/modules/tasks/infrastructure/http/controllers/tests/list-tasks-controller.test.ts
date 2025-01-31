import { describe, it, expect, vi, beforeEach } from "vitest";
import { Request } from "express";
import ListTasksController from "../list-tasks.controller";
import { IUseCase } from "../../../../../../shared/domain/usecase";
import { ListTasksDto } from "../../../dtos/list-tasks.dto";
import { Pagination } from "../../../../../../shared/domain/pagination.interface";
import { Task } from "../../../../domain/entities/task.entity";
import { Ok } from "../../../../../../shared/infrastructure/http/responses";

describe("ListTasksController", () => {
  let usecase: IUseCase<ListTasksDto, Pagination<Task>>;
  let controller: ListTasksController;

  beforeEach(() => {
    usecase = {
      execute: vi.fn(),
    };

    controller = new ListTasksController(usecase);
  });

  it("should call usecase.execute with correct parameters", async () => {
    const mockRequest = {
      query: { page: "1", limit: "10" },
      user: { id: 123 },
    } as unknown as Request;

    await controller.handle(mockRequest);

    expect(usecase.execute).toHaveBeenCalledWith({
      page: "1",
      limit: "10",
      userId: 123,
    });
  });

  it("should return Ok response with paginated tasks", async () => {
    const mockRequest = {
      query: { page: "1", limit: "10" },
      user: { id: 123 },
    } as unknown as Request;

    const mockPagination: Pagination<Task> = {
      data: [
        {
          id: 1,
          title: "Task 1",
          description: "Desc 1",
          userId: 123,
          status: "pending",
          dueDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          title: "Task 2",
          description: "Desc 2",
          userId: 123,
          status: "completed",
          dueDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      pagination: {
        firstPage: true,
        lastPage: true,
        pageNumber: 1,
        pageSize: 10,
        totalPages: 1,
      },
    };

    (usecase.execute as any).mockResolvedValue(mockPagination);

    const response = await controller.handle(mockRequest);

    expect(response).toEqual(Ok(mockPagination));
  });

  it("should throw an error if usecase.execute fails", async () => {
    const mockRequest = {
      query: { page: "1", limit: "10" },
      user: { id: 123 },
    } as unknown as Request;

    (usecase.execute as any).mockRejectedValue(
      new Error("Failed to list tasks")
    );

    await expect(controller.handle(mockRequest)).rejects.toThrow(
      "Failed to list tasks"
    );
  });
});
