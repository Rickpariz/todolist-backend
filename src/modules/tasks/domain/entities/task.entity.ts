import { User } from "../../../users/domain/entities/user.entity";

export type Task = {
  id: number;
  title: string;
  description: string;
  status: string;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
};

export type TaskWithUser = Task & { user: User };
