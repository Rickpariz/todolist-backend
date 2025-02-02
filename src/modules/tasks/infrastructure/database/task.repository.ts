import { Prisma, PrismaClient } from "@prisma/client";
import {
  FindAllParams,
  ITaskRepository,
} from "../../domain/repositories/task-repository.interface";
import { Task } from "../../domain/entities/task.entity";
import { CreateTaskUseCaseDto } from "../dtos/create-task.dto";
import {
  DEFAULT_PAGE_SIZE,
  mapPagination,
} from "../../../../shared/application/pagination";
import { Pagination } from "../../../../shared/domain/pagination.interface";

export default class TaskRepository implements ITaskRepository {
  constructor(readonly prisma: PrismaClient) {}

  async create(dto: CreateTaskUseCaseDto): Promise<Task> {
    return await this.prisma.task.create({
      data: { ...dto },
    });
  }

  async exists(params: { title?: string; userId?: number }): Promise<Boolean> {
    const { title, userId } = params;
    const task = await this.prisma.task.findFirst({
      where: {
        title,
        userId,
      },
    });

    return !!task;
  }

  async update(dto: Partial<Task>): Promise<Task> {
    return await this.prisma.task.update({
      where: { id: dto.id },
      data: dto,
    });
  }

  async findAll(params: FindAllParams): Promise<Pagination<Task>> {
    const {
      search,
      status,
      userId,
      orderBy,
      pagination: { pageNumber = 1, pageSize = DEFAULT_PAGE_SIZE },
    } = params;

    const where: Prisma.TaskWhereInput = {
      ...(status?.length ? { status: { in: status } } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search } },
              { description: { contains: search } },
            ],
          }
        : {}),
      userId,
      active: true,
    };

    const [tasks, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        take: pageSize,
        skip: (pageNumber - 1) * pageSize,
        ...(orderBy
          ? {
              orderBy: {
                [orderBy.field]: orderBy.direction,
              },
            }
          : {}),
      }),
      this.prisma.task.count({
        where,
      }),
    ]);

    const pagination = mapPagination({
      pageNumber,
      pageSize,
      total,
    });

    return {
      data: tasks,
      pagination,
    };
  }

  async delete(id: number): Promise<void> {
    await this.prisma.task.update({
      where: { id },
      data: { active: false },
    });
  }

  async findById(id: number): Promise<Task | null> {
    return await this.prisma.task.findUnique({ where: { id, active: true } });
  }

  async isDuplicateTitle(params: {
    title: string;
    userId: number;
    id: number;
  }): Promise<Boolean> {
    const { id, userId, title } = params;
    const count = await this.prisma.task.count({
      where: {
        title,
        userId,
        id: {
          not: id,
        },
      },
    });

    return count > 0;
  }
}
