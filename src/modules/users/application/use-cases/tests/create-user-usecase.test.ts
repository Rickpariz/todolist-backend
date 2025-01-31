import { vi } from "vitest";
import CreateUserUseCase from "../create-user.usecase";
import { User } from "@prisma/client";
import { hashSync } from "../../../../../shared/application/hash";
import { Conflict } from "../../../../../shared/infrastructure/http/responses";

const mockUserRepository = {
  create: vi.fn().mockResolvedValue({} as User),
  exists: vi.fn().mockResolvedValue(false),
  findByEmail: vi.fn(),
  isDuplicateEmail: vi.fn(),
  update: vi.fn(),
  findAll: vi.fn(),
};

describe("CreateUserUseCase", () => {
  let usecase: CreateUserUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    usecase = new CreateUserUseCase(mockUserRepository);
  });

  it("should create a new user successfully", async () => {
    const newUser = {
      name: "Ricardo Pariz",
      email: "ricardo.pariz@gmail.com",
      password: "1234",
    };

    const hashedPassword = "hashed_password";

    mockUserRepository.create.mockResolvedValue({
      ...newUser,
      password: hashedPassword,
    });

    const result = await usecase.execute(newUser);

    expect(result.name).toBe(newUser.name);
    expect(result.email).toBe(newUser.email);
  });

  it("should hash the password before saving", async () => {
    const password = "1234";
    const hashedPassword = hashSync(password);
    const dto = {
      name: "Ricardo Pariz",
      email: "ricardo.pariz@gmail.com",
      password,
    };

    mockUserRepository.exists.mockResolvedValue(false);
    mockUserRepository.create.mockResolvedValue({
      ...dto,
      password: hashedPassword,
    });

    await usecase.execute(dto);

    expect(mockUserRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        password: expect.not.stringContaining(password),
      })
    );
  });

  it("should throw an error if email already exists", async () => {
    const newUser = {
      name: "Ricardo Pariz",
      email: "ricardo.pariz@gmail.com",
      password: "1234",
    };

    mockUserRepository.exists.mockResolvedValue(true);

    await expect(usecase.execute(newUser)).rejects.toThrowError(
      Conflict("User with this email already exists")
    );

    expect(mockUserRepository.create).not.toHaveBeenCalled();
  });
});
