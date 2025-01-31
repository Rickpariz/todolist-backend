import { describe, it, expect, vi, Mock } from "vitest";
import * as jwt from "jsonwebtoken";
import RequestPasswordResetUseCase from "../request-password-reset.usecase";
import { IUserRepository } from "../../../../users/domain/repositories/user-repository.interface";
import { NotFound } from "../../../../../shared/infrastructure/http/responses";
import { ERRORS } from "../../../../../shared/domain/enums/errors.enum";

vi.mock("jsonwebtoken", () => ({
  sign: vi.fn().mockReturnValue("mocked-jwt-token"),
}));

describe("RequestPasswordResetUseCase", () => {
  let requestPasswordResetUseCase: RequestPasswordResetUseCase;
  let mockUserRepository: IUserRepository;

  beforeEach(() => {
    mockUserRepository = {
      findByEmail: vi.fn(),
      create: vi.fn(),
      exists: vi.fn(),
      isDuplicateEmail: vi.fn(),
      update: vi.fn(),
      findAll: vi.fn(),
    };

    requestPasswordResetUseCase = new RequestPasswordResetUseCase(
      mockUserRepository
    );
  });

  it("should throw NotFound if the user does not exist", async () => {
    const invalidEmail = "nonexistentuser@example.com";
    const validRequestPasswordResetDto = { email: invalidEmail };

    (mockUserRepository.findByEmail as Mock).mockResolvedValue(null);

    await expect(
      requestPasswordResetUseCase.execute(validRequestPasswordResetDto)
    ).rejects.toThrowError(NotFound("user not found"));
  });

  it("should generate a JWT token for an existing user", async () => {
    const validEmail = "user@example.com";
    const validRequestPasswordResetDto = { email: validEmail };
    const mockUser = { id: "user-id", name: "User Name", email: validEmail }; // Usuário mockado

    (mockUserRepository.findByEmail as Mock).mockResolvedValue(mockUser);

    const jwtSignSpy = vi
      .spyOn(jwt, "sign")
      .mockReturnValue("mocked-jwt-token" as any);

    const result = await requestPasswordResetUseCase.execute(
      validRequestPasswordResetDto
    );

    expect(jwtSignSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        roles: ["RESET_PASSWORD"],
      }),
      String(process.env.JWT_SECRET),
      expect.objectContaining({
        expiresIn: String(process.env.JWT_RESET_PASSWORD_EXPIRES_IN),
      })
    );

    expect(result.token).toBe("mocked-jwt-token");
  });

  it("should validate the input data using the requestPasswordResetDtoSchema", async () => {
    const invalidRequestPasswordResetDto = { email: "invalid-email" };

    try {
      await requestPasswordResetUseCase.execute(invalidRequestPasswordResetDto);
    } catch (err: any) {
      expect(err.message).toBe(ERRORS.VALIDATION_ERROR);
    }
  });
});
