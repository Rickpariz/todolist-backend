import { vi, expect, it, describe, beforeEach, Mock } from "vitest";
import { Request } from "express";
import CreateUserController from "../create-user.controller";
import { CreateUserUseCaseDto } from "../../../dtos/create-user.dto";
import { User } from "../../../../domain/entities/user.entity";
import { IUseCase } from "../../../../../../shared/domain/usecase";
import { Created } from "../../../../../../shared/infrastructure/http/responses";

vi.mock("../../../../application/use-cases/create-user.usecase");

describe("CreateUserController", () => {
  let controller: CreateUserController;
  let mockUseCase: IUseCase<CreateUserUseCaseDto, User>;

  beforeEach(() => {
    mockUseCase = {
      execute: vi.fn().mockResolvedValue({
        id: 1,
        name: "Ricardo Pariz",
        email: "ricardo.pariz@gmail.com",
      } as User),
    };
    controller = new CreateUserController(mockUseCase);
  });

  it("should be instantiated", () => {
    expect(controller).toBeInstanceOf(CreateUserController);
  });

  it("should call usecase.execute with the correct parameters", async () => {
    const req = {
      body: { name: "Ricardo Pariz", email: "ricardo.pariz@gmail.com" },
    } as Request;

    await controller.handle(req);

    expect(mockUseCase.execute).toHaveBeenCalledWith(req.body);
  });

  it("should return a Created response", async () => {
    const req = {
      body: { name: "Ricardo Pariz", email: "ricardo.pariz@gmail.com" },
    } as Request;

    const response = await controller.handle(req);

    expect(response).toEqual(
      Created({
        id: 1,
        name: "Ricardo Pariz",
        email: "ricardo.pariz@gmail.com",
      })
    );
  });

  it("should return an error if usecase.execute fails", async () => {
    const errorMessage = "Error executing use case";
    (mockUseCase.execute as Mock).mockRejectedValueOnce(
      new Error(errorMessage)
    );

    const req = {
      body: { name: "Ricardo Pariz", email: "ricardo.pariz@gmail.com" },
    } as Request;

    try {
      await controller.handle(req);
    } catch (error) {
      expect(error).toEqual(new Error(errorMessage));
    }
  });
});
