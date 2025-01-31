import { vi, expect, it, describe, beforeEach } from "vitest";
import RequestPasswordResetController from "../request-password-reset.controller";
import RequestPasswordResetUseCase from "../../../../application/use-cases/request-password-reset.usecase";
import { IUserRepository } from "../../../../../users/domain/repositories/user-repository.interface";
import { AccessToken } from "../../../../domain/entities/access-token.entity";
import { Request } from "express";
import { Ok } from "../../../../../../shared/infrastructure/http/responses";

vi.mock("../../../../application/use-cases/request-password-reset.usecase");

describe("RequestPasswordResetController", () => {
  let controller: RequestPasswordResetController;
  let mockUseCase: RequestPasswordResetUseCase;

  beforeEach(() => {
    mockUseCase = new RequestPasswordResetUseCase({} as IUserRepository);
    controller = new RequestPasswordResetController(mockUseCase);
  });

  it("should call usecase.execute and return Ok", async () => {
    const mockResponse = { token: "mocked-token" } as AccessToken;
    const mockRequest = { body: { email: "test@example.com" } } as Request;

    vi.spyOn(mockUseCase, "execute").mockResolvedValue(mockResponse);

    const result = await controller.handle(mockRequest);

    expect(mockUseCase.execute).toHaveBeenCalledWith(mockRequest.body);
    expect(result).toEqual(Ok(mockResponse));
  });

  it("should handle errors when usecase fails", async () => {
    const mockRequest = { body: { email: "test@example.com" } } as Request;

    vi.spyOn(mockUseCase, "execute").mockRejectedValue(
      new Error("User not found")
    );

    try {
      await controller.handle(mockRequest);
    } catch (error: any) {
      expect(error.message).toBe("User not found");
    }
  });
});
