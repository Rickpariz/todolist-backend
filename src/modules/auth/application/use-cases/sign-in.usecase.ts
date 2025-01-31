import { IUseCase } from "../../../../shared/domain/usecase";
import { Validate } from "../../../../shared/infrastructure/decorators/validation.decorator";
import { hashCompareSync } from "../../../../shared/application/hash";
import * as jwt from "jsonwebtoken";
import {
  SignInDto,
  signInDtoSchema,
} from "../../infrastructure/dtos/sign-in.dto";
import { AccessToken } from "../../domain/entities/access-token.entity";
import { IUserRepository } from "../../../users/domain/repositories/user-repository.interface";
import { Unauthorized } from "../../../../shared/infrastructure/http/responses";

export default class SignInUseCase implements IUseCase<SignInDto, AccessToken> {
  constructor(readonly repository: IUserRepository) {}

  @Validate(signInDtoSchema)
  async execute(data: SignInDto): Promise<AccessToken> {
    const { email, password } = data;

    const user = await this.repository.findByEmail(email);

    if (!user) throw Unauthorized();

    const isValidPassword = hashCompareSync(password, user.password);

    if (!isValidPassword) throw Unauthorized();

    const accessToken = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      String(process.env.JWT_SECRET),
      {
        expiresIn: String(process.env.JWT_EXPIRES_IN),
      }
    );

    return {
      token: accessToken,
    };
  }
}
