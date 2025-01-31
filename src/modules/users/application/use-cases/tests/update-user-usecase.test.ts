import { vi } from "vitest";
import UpdateUserUseCase from "../update-user.usecase";
import { User } from "@prisma/client";
import {
  Conflict,
  NotFound,
  Unauthorized,
} from "../../../../../shared/infrastructure/http/responses";

const mockUserRepository = {
  update: vi.fn().mockResolvedValue({} as User),
  exists: vi.fn().mockResolvedValue(false),
  isDuplicateEmail: vi.fn().mockResolvedValue(false),
  create: vi.fn().mockResolvedValue({} as User),
  findByEmail: vi.fn(),
  findAll: vi.fn(),
};

describe("UpdateUserUseCase", () => {
  let usecase: UpdateUserUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    usecase = new UpdateUserUseCase(mockUserRepository);
  });

  it("should update a user successfully", async () => {
    const updatedUser = {
      id: 1,
      name: "Ricardo Pariz Updated",
      email: "ricardo.pariz@gmail.com.com",
      tokenUser: {
        id: 1,
        name: "Ricardo Pariz",
        email: "ricardo.pariz@gmail.com",
      },
    };

    mockUserRepository.exists.mockResolvedValue(true);
    mockUserRepository.update.mockResolvedValue(updatedUser);

    const result = await usecase.execute(updatedUser);

    expect(result.name).toBe(updatedUser.name);
    expect(result.email).toBe(updatedUser.email);
    expect(mockUserRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({ id: updatedUser.id })
    );
  });

  it("should throw an error if user tries to update another user's data", async () => {
    const updatedUser = {
      id: 1,
      name: "Ricardo Pariz Updated",
      email: "ricardo.pariz@gmail.com.com",
      tokenUser: {
        id: 2,
        name: "Outro usuário",
        email: "other.user@gmail.com",
      },
    };

    await expect(usecase.execute(updatedUser)).rejects.toThrowError(
      Unauthorized()
    );
    expect(mockUserRepository.update).not.toHaveBeenCalled();
  });

  it("should throw an error if user does not exist", async () => {
    const updatedUser = {
      id: 1,
      name: "Ricardo Pariz Updated",
      email: "ricardo.pariz@gmail.com.com",
      tokenUser: {
        id: 1,
        name: "Ricardo Pariz",
        email: "ricardo.pariz@gmail.com",
      },
    };

    mockUserRepository.exists.mockResolvedValue(false);

    await expect(usecase.execute(updatedUser)).rejects.toThrowError(
      NotFound("user not found")
    );
    expect(mockUserRepository.update).not.toHaveBeenCalled();
  });

  it("should throw an error if email is already in use", async () => {
    const updatedUser = {
      id: 1,
      name: "Ricardo Pariz Updated",
      email: "ricardo.pariz@gmail.com.com",
      tokenUser: {
        id: 1,
        name: "Ricardo Pariz",
        email: "ricardo.pariz@gmail.com",
      },
    };

    mockUserRepository.exists.mockResolvedValue(true);
    mockUserRepository.isDuplicateEmail.mockResolvedValue(true);

    await expect(usecase.execute(updatedUser)).rejects.toThrowError(
      Conflict("User with this email already exists")
    );
    expect(mockUserRepository.update).not.toHaveBeenCalled();
  });
});
