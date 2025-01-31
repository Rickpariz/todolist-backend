import { vi, expect, it, describe, beforeEach, Mock } from "vitest";
import { Request } from "express";
import UpdateUserController from "../update-user.controller";
import { UpdateUserUseCaseDto } from "../../../dtos/update-user.dto";
import { User } from "../../../../domain/entities/user.entity";
import { IUseCase } from "../../../../../../shared/domain/usecase";
import { Ok } from "../../../../../../shared/infrastructure/http/responses";

vi.mock("../../../../application/use-cases/create-user.usecase");

describe("UpdateUserController", () => {
  let controller: UpdateUserController;
  let mockUseCase: IUseCase<UpdateUserUseCaseDto, User>;

  beforeEach(() => {
    mockUseCase = {
      execute: vi.fn().mockResolvedValue({
        id: 1,
        name: "Ricardo Pariz",
        email: "ricardo.pariz@gmail.com",
      } as User),
    };
    controller = new UpdateUserController(mockUseCase);
  });

  it("should be instantiated", () => {
    expect(controller).toBeInstanceOf(UpdateUserController);
  });

  it("should call usecase.execute with the correct parameters", async () => {
    const req = {
      body: { name: "Ricardo Pariz", email: "ricardo.pariz@gmail.com" },
      params: { id: "1" },
      user: { id: 1 },
    } as unknown as Request;

    await controller.handle(req);

    expect(mockUseCase.execute).toHaveBeenCalledWith({
      id: 1,
      name: "Ricardo Pariz",
      email: "ricardo.pariz@gmail.com",
      tokenUser: { id: 1 },
    });
  });

  it("should return an Ok response with the updated user", async () => {
    const req = {
      body: { name: "Ricardo Pariz", email: "ricardo.pariz@gmail.com" },
      params: { id: "1" },
      user: { id: 1 },
    } as unknown as Request;

    const response = await controller.handle(req);

    expect(response).toEqual(
      Ok({
        id: 1,
        name: "Ricardo Pariz",
        email: "ricardo.pariz@gmail.com",
      })
    );
  });

  it("should return an error if usecase.execute fails", async () => {
    const errorMessage = "Error updating user";
    (mockUseCase.execute as Mock).mockRejectedValueOnce(
      new Error(errorMessage)
    );

    const req = {
      body: { name: "Ricardo Pariz", email: "ricardo.pariz@gmail.com" },
      params: { id: "1" },
      user: { id: 1 },
    } as unknown as Request;

    try {
      await controller.handle(req);
    } catch (error) {
      expect(error).toEqual(new Error(errorMessage));
    }
  });
});
