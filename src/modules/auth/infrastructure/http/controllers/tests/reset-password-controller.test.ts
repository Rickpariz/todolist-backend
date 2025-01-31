import { vi, expect, it, describe, beforeEach, Mock } from "vitest";
import { Request } from "express";
import ResetPasswordController from "../reset-password.controller";
import ResetPasswordUsecase from "../../../../application/use-cases/reset-password.usecase";
import { IUserRepository } from "../../../../../users/domain/repositories/user-repository.interface";
import { extractTokenFromHeaders } from "../../../../../../shared/infrastructure/http/middlewares/auth";
import { User } from "../../../../../users/domain/entities/user.entity";
import { Ok } from "../../../../../../shared/infrastructure/http/responses";

vi.mock("../../../../application/use-cases/reset-password.usecase");
vi.mock(
  "../../../../../../shared/infrastructure/http/middlewares/auth",
  () => ({
    extractTokenFromHeaders: vi.fn(),
  })
);

describe("ResetPasswordController", () => {
  let controller: ResetPasswordController;
  let mockUseCase: ResetPasswordUsecase;
  let mockRequest: Request;

  beforeEach(() => {
    mockUseCase = new ResetPasswordUsecase({} as IUserRepository);
    controller = new ResetPasswordController(mockUseCase);
    mockRequest = {
      body: { password: "newpassword123" },
      headers: { authorization: "Bearer mocked-token" },
    } as Request;
  });

  it("should call usecase.execute and return Ok", async () => {
    const mockUser = {
      id: 1,
      name: "Test User",
      email: "test@example.com",
    } as User;

    vi.spyOn(mockUseCase, "execute").mockResolvedValue(mockUser);

    (extractTokenFromHeaders as Mock).mockReturnValue("mocked-token");

    const result = await controller.handle(mockRequest);

    expect(extractTokenFromHeaders).toHaveBeenCalledWith(mockRequest);
    expect(mockUseCase.execute).toHaveBeenCalledWith({
      token: "mocked-token",
      password: "newpassword123",
    });
    expect(result).toEqual(Ok(mockUser));
  });

  it("should handle errors when usecase fails", async () => {
    const mockError = new Error("Failed to reset password");

    vi.spyOn(mockUseCase, "execute").mockRejectedValue(mockError);

    try {
      await controller.handle(mockRequest);
    } catch (error: any) {
      expect(error.message).toBe("Failed to reset password");
    }
  });
});
