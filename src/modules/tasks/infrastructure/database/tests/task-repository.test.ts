import { describe, it, expect, vi, beforeEach } from "vitest";
import { PrismaClient } from "@prisma/client";
import TaskRepository from "../task.repository";
import { CreateTaskUseCaseDto } from "../../dtos/create-task.dto";
import { Task } from "../../../domain/entities/task.entity";

describe("TaskRepository", () => {
  let prismaMock: PrismaClient;
  let repository: TaskRepository;

  beforeEach(() => {
    prismaMock = {
      task: {
        create: vi.fn(),
        findFirst: vi.fn(),
        update: vi.fn(),
        findMany: vi.fn(),
        count: vi.fn(),
        findUnique: vi.fn(),
      },
    } as unknown as PrismaClient;

    repository = new TaskRepository(prismaMock);
  });

  it("should create a task", async () => {
    const taskData: CreateTaskUseCaseDto = {
      title: "Test Task",
      description: "This is a test",
      status: "pending",
      dueDate: new Date(),
      userId: 1,
    };

    const createdTask: Task = {
      id: 1,
      ...taskData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (prismaMock.task.create as any).mockResolvedValue(createdTask);

    const result = await repository.create(taskData);

    expect(prismaMock.task.create).toHaveBeenCalledWith({ data: taskData });
    expect(result).toEqual(createdTask);
  });

  it("should check if task exists", async () => {
    (prismaMock.task.findFirst as any).mockResolvedValue({ id: 1 });

    const result = await repository.exists({ title: "Test Task", userId: 1 });

    expect(prismaMock.task.findFirst).toHaveBeenCalledWith({
      where: { title: "Test Task", userId: 1 },
    });
    expect(result).toBe(true);
  });

  it("should return false if task does not exist", async () => {
    (prismaMock.task.findFirst as any).mockResolvedValue(null);

    const result = await repository.exists({ title: "Test Task", userId: 1 });

    expect(result).toBe(false);
  });

  it("should update a task", async () => {
    const updateData = { id: 1, title: "Updated Task" };
    const updatedTask: Task = {
      id: 1,
      title: "Updated Task",
      description: "",
      userId: 1,
      status: "pending",
      dueDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (prismaMock.task.update as any).mockResolvedValue(updatedTask);

    const result = await repository.update(updateData);

    expect(prismaMock.task.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: updateData,
    });
    expect(result).toEqual(updatedTask);
  });

  it("should return paginated and order tasks", async () => {
    const tasks: Task[] = [
      {
        id: 1,
        title: "Task 1",
        description: "",
        userId: 1,
        status: "pending",
        dueDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        title: "Task 2",
        description: "",
        userId: 1,
        status: "pending",
        dueDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    (prismaMock.task.findMany as any).mockResolvedValue(tasks);
    (prismaMock.task.count as any).mockResolvedValue(2);

    const result = await repository.findAll({
      userId: 1,
      pagination: { pageNumber: 1, pageSize: 10 },
      orderBy: {
        direction: "asc",
        field: "dueDate",
      },
    });

    expect(result.data).toEqual(tasks);
    expect(result.pagination.totalPages).toBe(1);
  });

  it("should return paginated tasks", async () => {
    const tasks: Task[] = [
      {
        id: 1,
        title: "Task 1",
        description: "",
        userId: 1,
        status: "pending",
        dueDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        title: "Task 2",
        description: "",
        userId: 1,
        status: "pending",
        dueDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    (prismaMock.task.findMany as any).mockResolvedValue(tasks);
    (prismaMock.task.count as any).mockResolvedValue(2);

    const result = await repository.findAll({
      userId: 1,
      pagination: { pageNumber: 1, pageSize: 10 },
    });

    expect(result.data).toEqual(tasks);
    expect(result.pagination.totalPages).toBe(1);
  });

  it("should soft delete a task", async () => {
    await repository.delete(1);

    expect(prismaMock.task.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { active: false },
    });
  });

  it("should find a task by id", async () => {
    const task: Task = {
      id: 1,
      title: "Task",
      description: "",
      userId: 1,
      status: "pending",
      dueDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (prismaMock.task.findUnique as any).mockResolvedValue(task);

    const result = await repository.findById(1);

    expect(prismaMock.task.findUnique).toHaveBeenCalledWith({
      where: { id: 1, active: true },
    });
    expect(result).toEqual(task);
  });

  it("should check if a title is duplicate", async () => {
    (prismaMock.task.count as any).mockResolvedValue(1);

    const result = await repository.isDuplicateTitle({
      title: "Task",
      userId: 1,
      id: 2,
    });

    expect(prismaMock.task.count).toHaveBeenCalledWith({
      where: { title: "Task", userId: 1, id: { not: 2 } },
    });
    expect(result).toBe(true);
  });

  it("should return false if no duplicate title exists", async () => {
    (prismaMock.task.count as any).mockResolvedValue(0);

    const result = await repository.isDuplicateTitle({
      title: "Task",
      userId: 1,
      id: 2,
    });

    expect(result).toBe(false);
  });
});
