import { PrismaClient } from "@prisma/client";
import { BaseUser, User } from "../../domain/entities/user.entity";
import { CreateUserUseCaseDto } from "../dtos/create-user.dto";
import { IUserRepository } from "../../domain/repositories/user-repository.interface";

export default class UserRepository implements IUserRepository {
  constructor(readonly prisma: PrismaClient) {}

  async create(dto: CreateUserUseCaseDto): Promise<User> {
    return this.prisma.user.create({
      data: dto,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async exists(params: { email?: string; id?: number }): Promise<Boolean> {
    const { email, id } = params;
    const count = await this.prisma.user.count({
      where: {
        ...(email ? { email } : {}),
        ...(id ? { id } : {}),
      },
    });

    return count > 0;
  }

  async findByEmail(email: string): Promise<BaseUser | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async isDuplicateEmail(params: {
    email: string;
    id: number;
  }): Promise<Boolean> {
    const { id, email } = params;
    const count = await this.prisma.user.count({
      where: {
        email,
        id: {
          not: id,
        },
      },
    });

    return count > 0;
  }

  async update({ id, ...data }: Partial<BaseUser>): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: {
        ...data,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
