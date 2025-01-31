import { describe, it, expect, vi, beforeEach, afterEach, Mock } from "vitest";
import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { authorize, extractTokenFromHeaders } from ".";
import { DomainError } from "../../../../domain/domain.error";

vi.mock("jsonwebtoken", async (importOriginal) => {
  const actual = await importOriginal<typeof import("jsonwebtoken")>();

  return {
    ...actual,
    TokenExpiredError: actual.TokenExpiredError,
    verify: vi.fn().mockImplementation(() => {
      throw new actual.TokenExpiredError("Token is expired", new Date());
    }),
  };
});

describe("authorize middleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let statusMock: Mock;
  let jsonMock: Mock;

  beforeEach(() => {
    jsonMock = vi.fn();
    statusMock = vi.fn().mockReturnValue({ json: jsonMock });

    mockRequest = {
      headers: {
        authorization: "Bearer valid.token",
      },
    };
    mockResponse = {
      status: statusMock,
      json: jsonMock,
    } as Partial<Response>;
    mockNext = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should authorize a valid token", async () => {
    (jwt.verify as Mock).mockReturnValue({
      id: 1,
      email: "user@example.com",
      name: "John Doe",
    });

    await authorize(mockRequest as Request, mockResponse as Response, mockNext);

    expect(jwt.verify).toHaveBeenCalledWith("valid.token", expect.any(String));
    expect(mockRequest.user).toEqual({
      id: 1,
      email: "user@example.com",
      name: "John Doe",
    });
    expect(mockNext).toHaveBeenCalled();
  });

  it("should return 401 when token is missing", async () => {
    mockRequest.headers = {};

    await authorize(mockRequest as Request, mockResponse as Response, mockNext);

    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith({ message: "UNAUTHORIZED" });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should return 401 when token is invalid", async () => {
    (jwt.verify as Mock).mockImplementation(() => {
      throw new jwt.JsonWebTokenError("invalid token");
    });

    await authorize(mockRequest as Request, mockResponse as Response, mockNext);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({ message: expect.any(Error) });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should return 401 when token is expired", async () => {
    (jwt.verify as Mock).mockImplementation(() => {
      throw new jwt.TokenExpiredError("jwt expired", new Date());
    });

    await authorize(mockRequest as Request, mockResponse as Response, mockNext);

    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith({ message: "jwt expired" });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should return correct status and message when DomainError is thrown", async () => {
    const domainError = new DomainError({
      message: "Invalid Token",
      statusCode: 403,
    });

    (jwt.verify as Mock).mockImplementation(() => {
      throw domainError;
    });

    await authorize(mockRequest as Request, mockResponse as Response, mockNext);

    expect(statusMock).toHaveBeenCalledWith(403);
    expect(jsonMock).toHaveBeenCalledWith({
      message: "Invalid Token",
      errors: undefined,
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should return 500 on unexpected errors", async () => {
    (jwt.verify as Mock).mockImplementation(() => {
      throw new Error("Unexpected Error");
    });

    await authorize(mockRequest as Request, mockResponse as Response, mockNext);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({ message: expect.any(Error) });
    expect(mockNext).not.toHaveBeenCalled();
  });
});

describe("extractTokenFromHeaders", () => {
  it("should extract token correctly from Authorization header", () => {
    const mockRequest = {
      headers: {
        authorization: "Bearer some.jwt.token",
      },
    } as Request;

    const token = extractTokenFromHeaders(mockRequest);
    expect(token).toBe("some.jwt.token");
  });

  it("should throw Unauthorized error when Authorization header is missing", () => {
    const mockRequest = {
      headers: {},
    } as Request;

    expect(() => extractTokenFromHeaders(mockRequest)).toThrow("UNAUTHORIZED");
  });
});
