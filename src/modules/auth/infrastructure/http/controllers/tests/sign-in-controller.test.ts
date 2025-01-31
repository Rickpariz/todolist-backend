import { vi, expect, it, describe, beforeEach } from "vitest";
import { Request } from "express";
import SignInController from "../sign-in.controller";
import SignInUseCase from "../../../../application/use-cases/sign-in.usecase";
import { AccessToken } from "../../../../domain/entities/access-token.entity";
import { Ok } from "../../../../../../shared/infrastructure/http/responses";

vi.mock("../../../../application/use-cases/sign-in.usecase");

describe("SignInController", () => {
  let controller: SignInController;
  let mockUseCase: SignInUseCase;
  let mockRequest: Request;

  beforeEach(() => {
    mockUseCase = new SignInUseCase({} as any);
    controller = new SignInController(mockUseCase);
    mockRequest = {
      body: { email: "test@example.com", password: "password123" },
    } as Request;
  });

  it("should call usecase.execute and return Ok with an AccessToken", async () => {
    const mockAccessToken: AccessToken = { token: "mocked-jwt-token" };

    vi.spyOn(mockUseCase, "execute").mockResolvedValue(mockAccessToken);

    const result = await controller.handle(mockRequest);

    expect(mockUseCase.execute).toHaveBeenCalledWith(mockRequest.body);
    expect(result).toEqual(Ok(mockAccessToken));
  });

  it("should handle errors when usecase fails", async () => {
    const mockError = new Error("Invalid credentials");

    vi.spyOn(mockUseCase, "execute").mockRejectedValue(mockError);

    try {
      await controller.handle(mockRequest);
    } catch (error: any) {
      expect(error.message).toBe("Invalid credentials");
    }
  });
});
