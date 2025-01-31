import { Entity } from "../../../../shared/domain/entity";
import { User } from "../../../users/domain/entities/user.entity";

export type Task = {
  title: string;
  description: string;
  status: string;
  dueDate: Date;
  userId: number;
} & Entity;

export type TaskWithUser = Task & { user: User };
