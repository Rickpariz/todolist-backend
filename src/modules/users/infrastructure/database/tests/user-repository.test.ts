import { describe, it, expect, beforeEach, vi } from "vitest";
import { PrismaClient } from "@prisma/client";
import UserRepository from "../user.repository";
import { IUserRepository } from "../../../domain/repositories/user-repository.interface";

const mockPrisma = {
  user: {
    create: vi.fn(),
    count: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    findMany: vi.fn(),
  },
};

vi.mock("@prisma/client", () => {
  return {
    PrismaClient: vi.fn(() => mockPrisma),
  };
});

describe("UserRepository", () => {
  let repository: IUserRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new UserRepository(new PrismaClient());
  });

  it("should create a new user successfully", async () => {
    const newUser = {
      id: 1,
      name: "Ricardo Pariz",
      email: "ricardo.pariz@gmail.com",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockPrisma.user.create.mockResolvedValue(newUser);
    const result = await repository.create({
      name: "Ricardo Pariz",
      email: "ricardo.pariz@gmail.com",
      password: "hashed_password",
    });

    expect(result).toEqual(newUser);
    expect(mockPrisma.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ email: "ricardo.pariz@gmail.com" }),
      })
    );
  });

  it("should return true if user exists", async () => {
    mockPrisma.user.count.mockResolvedValue(1);
    const exists = await repository.exists({
      email: "ricardo.pariz@gmail.com",
    });
    expect(exists).toBe(true);
  });

  it("should return false if user does not exist", async () => {
    mockPrisma.user.count.mockResolvedValue(0);
    const exists = await repository.exists({
      email: "ricardo.pariz@gmail.com",
    });
    expect(exists).toBe(false);
  });

  it("should find a user by email", async () => {
    const user = {
      id: 1,
      name: "Ricardo Pariz",
      email: "ricardo.pariz@gmail.com",
    };
    mockPrisma.user.findUnique.mockResolvedValue(user);

    const result = await repository.findByEmail("ricardo.pariz@gmail.com");
    expect(result).toEqual(user);
  });

  it("should return null if user is not found", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    const result = await repository.findByEmail("unknown@example.com");
    expect(result).toBeNull();
  });

  it("should return true if email is duplicated", async () => {
    mockPrisma.user.count.mockResolvedValue(1);
    const isDuplicate = await repository.isDuplicateEmail({
      email: "ricardo.pariz@gmail.com",
      id: 2,
    });
    expect(isDuplicate).toBe(true);
  });

  it("should return false if email is not duplicated", async () => {
    mockPrisma.user.count.mockResolvedValue(0);
    const isDuplicate = await repository.isDuplicateEmail({
      email: "unique@example.com",
      id: 2,
    });
    expect(isDuplicate).toBe(false);
  });

  it("should update a user successfully", async () => {
    const updatedUser = {
      id: 1,
      name: "Ricardo Pariz",
      email: "ricardo.pariz@gmail.com",
    };
    mockPrisma.user.update.mockResolvedValue(updatedUser);

    const result = await repository.update({ id: 1, name: "Ricardo Pariz" });
    expect(result).toEqual(updatedUser);
  });

  it("should retrieve all users", async () => {
    const users = [
      { id: 1, name: "Ricardo Pariz", email: "ricardo.pariz@gmail.com" },
      { id: 2, name: "Other User", email: "other.user@gmail.com" },
    ];
    mockPrisma.user.findMany.mockResolvedValue(users);

    const result = await repository.findAll();
    expect(result).toEqual(users);
  });

  it("should return true if a user exists by email", async () => {
    const email = "ricardo.pariz@gmail.com";

    mockPrisma.user.count.mockResolvedValue(1);

    const existsByEmail = await repository.exists({ email });

    expect(existsByEmail).toBe(true);
    expect(mockPrisma.user.count).toHaveBeenCalledWith({
      where: { email },
    });
  });

  it("should return true if a user exists by id", async () => {
    const id = 1;

    mockPrisma.user.count.mockResolvedValue(1);

    const existsById = await repository.exists({ id });

    expect(existsById).toBe(true);
    expect(mockPrisma.user.count).toHaveBeenCalledWith({
      where: { id },
    });
  });

  it("should return false if no user exists with given email", async () => {
    const email = "ricardo.pariz@gmail.com";

    mockPrisma.user.count.mockResolvedValue(0);

    const existsByEmail = await repository.exists({ email });

    expect(existsByEmail).toBe(false);
    expect(mockPrisma.user.count).toHaveBeenCalledWith({
      where: { email },
    });
  });

  it("should return false if no user exists with given id", async () => {
    const id = 9999;

    mockPrisma.user.count.mockResolvedValue(0);

    const existsById = await repository.exists({ id });

    expect(existsById).toBe(false);
    expect(mockPrisma.user.count).toHaveBeenCalledWith({
      where: { id },
    });
  });
});
