import { Pagination } from "../../../../shared/domain/pagination.interface";
import { CreateTaskUseCaseDto } from "../../infrastructure/dtos/create-task.dto";
import { Task } from "../entities/task.entity";

export interface FindAllParams {
  userId: number;
  pagination: {
    pageNumber: number;
    pageSize: number;
  };
  orderBy?: {
    field: string;
    direction: "asc" | "desc";
  };
}

export interface ITaskRepository {
  create: (dto: CreateTaskUseCaseDto) => Promise<Task>;
  exists: (params: { title?: string; userId?: number }) => Promise<Boolean>;
  update: (dto: Partial<Task>) => Promise<Task>;
  findAll: (params: FindAllParams) => Promise<Pagination<Task>>;
  findById: (id: number) => Promise<Task | null>;
  delete: (id: number) => Promise<void>;
  isDuplicateTitle(params: {
    title: string;
    userId: number;
    id: number;
  }): Promise<Boolean>;
}
