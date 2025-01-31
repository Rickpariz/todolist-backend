import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { Request, Response } from "express";
import { Controller } from "../../../domain/controller";
import { DomainError } from "../../../domain/domain.error";
import logger from "../../logger";
import main from ".";

vi.mock("../../logger", () => ({
  default: {
    error: vi.fn(),
  },
}));

describe("main middleware", () => {
  let mockController: Controller;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: Mock;
  let statusMock: Mock;

  beforeEach(() => {
    jsonMock = vi.fn();
    statusMock = vi.fn().mockReturnValue({ json: jsonMock });

    mockRequest = {
      body: {},
      params: {},
      user: { id: 1, email: "ricardo.pariz@gmail.com", name: "Ricardo Pariz" },
    };
    mockResponse = {
      status: statusMock,
      json: jsonMock,
    } as Partial<Response>;

    mockController = {
      handle: vi.fn(),
    } as unknown as Controller;
  });

  it("should return correct status and body when service.handle() succeeds", async () => {
    (mockController.handle as any).mockResolvedValue({
      statusCode: 200,
      body: { message: "Success" },
    });

    const handler = main(mockController);
    await handler(mockRequest as Request, mockResponse as Response);

    expect(mockController.handle).toHaveBeenCalledWith(mockRequest);
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({ message: "Success" });
  });

  it("should return correct status and message when DomainError is thrown", async () => {
    const domainError = new DomainError({
      message: "Error message",
      errors: [],
      statusCode: 400,
    });

    (mockController.handle as any).mockRejectedValue(domainError);

    const handler = main(mockController);
    await handler(mockRequest as Request, mockResponse as Response);

    expect(logger.error).toHaveBeenCalledWith(domainError.message);
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      message: "Error message",
      errors: [],
    });
  });

  it("should return status 500 and log error when an unexpected error occurs", async () => {
    const unexpectedError = new Error("Something went wrong");

    (mockController.handle as any).mockRejectedValue(unexpectedError);

    const handler = main(mockController);
    await handler(mockRequest as Request, mockResponse as Response);

    expect(logger.error).toHaveBeenCalledWith("Something went wrong");
    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({ message: unexpectedError });
  });

  it("should return status 500 and log when an error is not an instance of Error", async () => {
    (mockController.handle as any).mockRejectedValue("Unknown error");

    const handler = main(mockController);
    await handler(mockRequest as Request, mockResponse as Response);

    expect(logger.error).toHaveBeenCalledWith("Unknown error");
    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({ message: "Unknown error" });
  });
});
