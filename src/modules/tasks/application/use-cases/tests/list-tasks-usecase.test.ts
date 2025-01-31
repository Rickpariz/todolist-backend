import { Mocked } from "vitest";
import ListTasksUseCase from "../list-tasks.usecase";
import { ITaskRepository } from "../../../domain/repositories/task-repository.interface";
import { Task } from "../../../domain/entities/task.entity";
import { Pagination } from "../../../../../shared/domain/pagination.interface";
import { ListTasksDto } from "../../../infrastructure/dtos/list-tasks.dto";
import { DEFAULT_PAGE_SIZE } from "../../../../../shared/application/pagination";
import { ERRORS } from "../../../../../shared/domain/enums/errors.enum";

describe("ListTasksUseCase", () => {
  let listTasksUseCase: ListTasksUseCase;
  let taskRepository: Mocked<ITaskRepository>;

  beforeEach(() => {
    taskRepository = {
      findAll: vi.fn(),
    } as unknown as Mocked<ITaskRepository>;

    listTasksUseCase = new ListTasksUseCase(taskRepository);
  });

  it("should return a paginated list of tasks", async () => {
    const userId = 1;
    const mockTasks: Task[] = [
      {
        id: 1,
        title: "Task 1",
        description: "Description 1",
        status: "pending",
        userId,
        dueDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        title: "Task 2",
        description: "Description 2",
        status: "done",
        userId,
        dueDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const mockPagination: Pagination<Task> = {
      data: mockTasks,
      pagination: {
        totalPages: mockTasks.length,
        pageNumber: 1,
        pageSize: 2,
        firstPage: true,
        lastPage: true,
      },
    };

    taskRepository.findAll.mockResolvedValue(mockPagination);

    const dto: ListTasksDto = {
      userId,
      pageSize: "2",
      pageNumber: "1",
      orderBy: {
        field: "dueDate",
        direction: "asc",
      },
    };

    const result = await listTasksUseCase.execute(dto);

    const { orderBy, pageNumber, pageSize } = dto;
    expect(taskRepository.findAll).toHaveBeenCalledWith({
      userId,
      orderBy,
      pagination: {
        pageNumber: dto.pageNumber ? Number(pageNumber) : 1,
        pageSize: pageSize ? Number(pageSize) : DEFAULT_PAGE_SIZE,
      },
    });
    expect(result).toEqual(mockPagination);
  });

  it("should use default values for pageNumber and pageSize", async () => {
    const userId = 1;

    const mockPagination: Pagination<Task> = {
      data: [],
      pagination: {
        pageNumber: 1,
        pageSize: 10,
        totalPages: 0,
        lastPage: false,
        firstPage: true,
      },
    };

    taskRepository.findAll.mockResolvedValue(mockPagination);

    const dto = {
      userId,
    } as any;

    const result = await listTasksUseCase.execute(dto);

    expect(taskRepository.findAll).toHaveBeenCalledWith({
      userId,
      orderBy: undefined,
      pagination: { pageNumber: 1, pageSize: DEFAULT_PAGE_SIZE },
    });
    expect(result).toEqual(mockPagination);
  });

  it("should return an empty list if no tasks exist", async () => {
    const userId = 1;

    const mockPagination: Pagination<Task> = {
      data: [],
      pagination: {
        pageNumber: 1,
        pageSize: 10,
        totalPages: 0,
        lastPage: false,
        firstPage: true,
      },
    };

    taskRepository.findAll.mockResolvedValue(mockPagination);

    const dto: ListTasksDto = { userId, pageNumber: "1", pageSize: "10" };

    const result = await listTasksUseCase.execute(dto);

    expect(result.data).toHaveLength(0);
    expect(result.pagination.totalPages).toBe(0);
  });

  it("should throw a validation error if userId is missing", async () => {
    const invalidDto = {
      pageNumber: 1,
      pageSize: 10,
    } as unknown as ListTasksDto;

    try {
      await listTasksUseCase.execute(invalidDto);
    } catch (err: any) {
      await expect(err.message).toBe(ERRORS.VALIDATION_ERROR);
    }
  });
});
