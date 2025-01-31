import { describe, it, expect, vi } from "vitest";
import * as jwt from "jsonwebtoken";
import ResetPasswordUsecase from "../reset-password.usecase";
import { IUserRepository } from "../../../../users/domain/repositories/user-repository.interface";
import {
  NotFound,
  Unauthorized,
} from "../../../../../shared/infrastructure/http/responses";
import { JWT_ROLES } from "../../../../../shared/domain/enums/jwt-roles";
import { User } from "../../../../users/domain/entities/user.entity";

describe("ResetPasswordUsecase", () => {
  let resetPasswordUsecase: ResetPasswordUsecase;
  let mockUserRepository: IUserRepository;

  beforeEach(() => {
    mockUserRepository = {
      exists: vi.fn(),
      update: vi.fn(),
      create: vi.fn(),
      findByEmail: vi.fn(),
      isDuplicateEmail: vi.fn(),
      findAll: vi.fn(),
    };

    resetPasswordUsecase = new ResetPasswordUsecase(mockUserRepository);
  });

  it("should validate the input data using the resetPasswordDtoSchema", async () => {
    const invalidResetPasswordDto: any = {
      password: "short",
      token: "invalid",
    };

    const spy = vi
      .spyOn(resetPasswordUsecase, "execute")
      .mockRejectedValue(Unauthorized());

    await expect(
      resetPasswordUsecase.execute(invalidResetPasswordDto)
    ).rejects.toThrowError(Unauthorized());

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("should throw Unauthorized if the token is invalid", async () => {
    const invalidToken = "invalid-token";
    const validResetPasswordDto = {
      password: "1234",
      token: invalidToken,
    };

    vi.stubGlobal(
      "verify",
      vi.fn().mockImplementation(() => {
        throw new Error("Invalid token");
      })
    );

    await expect(
      resetPasswordUsecase.execute(validResetPasswordDto)
    ).rejects.toThrowError(Unauthorized());
  });

  it("should throw Unauthorized if the token does not have RESET_PASSWORD role", async () => {
    const tokenWithoutRole = jwt.sign(
      { id: "userId", roles: [] },
      String(process.env.JWT_SECRET)
    );
    const validResetPasswordDto = {
      password: "1234",
      token: tokenWithoutRole,
    };

    await expect(
      resetPasswordUsecase.execute(validResetPasswordDto)
    ).rejects.toThrowError(Unauthorized());
  });

  it("should throw NotFound if the user does not exist", async () => {
    const validToken = jwt.sign(
      { id: "userId", roles: [JWT_ROLES.RESET_PASSWORD] },
      String(process.env.JWT_SECRET)
    );
    const validResetPasswordDto = {
      password: "1234",
      token: validToken,
    };

    vi.spyOn(mockUserRepository, "exists").mockResolvedValue(false); // Simula que o usuário não existe

    await expect(
      resetPasswordUsecase.execute(validResetPasswordDto)
    ).rejects.toThrowError(NotFound("user not found"));
  });

  it("should successfully reset the password", async () => {
    const validToken = jwt.sign(
      { id: "userId", roles: [JWT_ROLES.RESET_PASSWORD] },
      String(process.env.JWT_SECRET)
    );
    const validResetPasswordDto = {
      password: "1234",
      token: validToken,
    };

    const mockUser: User = {
      id: 1,
      name: "Ricardo Pariz",
      email: "ricardo.pariz@gmail.com",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Simula o repositório retornando o usuário existente e a atualização bem-sucedida
    vi.spyOn(mockUserRepository, "exists").mockResolvedValue(true);
    vi.spyOn(mockUserRepository, "update").mockResolvedValue({
      ...mockUser,
    });

    await resetPasswordUsecase.execute(validResetPasswordDto);

    expect(mockUserRepository.update).toHaveBeenCalledWith({
      id: "userId",
      password: expect.any(String),
    });
  });
});
