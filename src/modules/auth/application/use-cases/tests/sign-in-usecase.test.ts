import { vi, expect, it, describe, beforeEach, Mock } from "vitest";
import SignInUseCase from "../sign-in.usecase";
import * as jwt from "jsonwebtoken";
import { IUserRepository } from "../../../../users/domain/repositories/user-repository.interface";
import { SignInDto } from "../../../infrastructure/dtos/sign-in.dto";
import { Unauthorized } from "../../../../../shared/infrastructure/http/responses";
import { hashCompareSync } from "../../../../../shared/application/hash";
import { AccessToken } from "../../../domain/entities/access-token.entity";

vi.mock("jsonwebtoken", () => ({
  sign: vi.fn().mockReturnValue("mocked_token"),
}));

vi.mock("../../../../../shared/application/hash");

describe("SignInUseCase", () => {
  let signInUseCase: SignInUseCase;
  let userRepository: IUserRepository;

  beforeEach(() => {
    userRepository = {
      findByEmail: vi.fn(),
      create: vi.fn(),
      exists: vi.fn(),
      isDuplicateEmail: vi.fn(),
      update: vi.fn(),
      findAll: vi.fn(),
    };

    signInUseCase = new SignInUseCase(userRepository);
  });

  it("should throw Unauthorized if the user is not found", async () => {
    (userRepository.findByEmail as Mock).mockResolvedValue(null);

    const signInDto: SignInDto = {
      email: "ricardo.pariz@gmail.com",
      password: "1234",
    };

    await expect(signInUseCase.execute(signInDto)).rejects.toThrow(
      Unauthorized()
    );
  });

  it("should throw Unauthorized if the password is incorrect", async () => {
    (userRepository.findByEmail as Mock).mockResolvedValue({
      id: 1,
      name: "Ricardo Pariz",
      email: "ricardo.pariz@gmail.com",
      password: "1234",
    });

    const signInDto: SignInDto = {
      email: "ricardo.pariz@gmail.com",
      password: "wrong_password",
    };

    vi.mocked(hashCompareSync).mockReturnValue(false);

    await expect(signInUseCase.execute(signInDto)).rejects.toThrow(
      Unauthorized()
    );
  });

  it("should return an access token if the credentials are correct", async () => {
    (userRepository.findByEmail as Mock).mockResolvedValue({
      id: 1,
      name: "Ricardo Pariz",
      email: "ricardo.pariz@gmail.com",
      password: "hashed_password",
    });

    const signInDto: SignInDto = {
      email: "ricardo.pariz@gmail.com",
      password: "correct_password",
    };

    vi.mocked(hashCompareSync).mockReturnValue(true);

    const result: AccessToken = await signInUseCase.execute(signInDto);

    expect(jwt.sign).toHaveBeenCalledWith(
      { id: 1, name: "Ricardo Pariz", email: "ricardo.pariz@gmail.com" },
      String(process.env.JWT_SECRET),
      { expiresIn: String(process.env.JWT_EXPIRES_IN) }
    );

    expect(result).toEqual({ token: "mocked_token" });
  });
});
