import { IUseCase } from "../../../../shared/domain/usecase";
import { Validate } from "../../../../shared/infrastructure/decorators/validation.decorator";
import * as jwt from "jsonwebtoken";
import { JWT_ROLES } from "../../../../shared/domain/enums/jwt-roles";
import {
  RequestPasswordResetDto,
  requestPasswordResetDtoSchema,
} from "../../infrastructure/dtos/request-password-reset.dto";
import { AccessToken } from "../../domain/entities/access-token.entity";
import { IUserRepository } from "../../../users/domain/repositories/user-repository.interface";
import { NotFound } from "../../../../shared/infrastructure/http/responses";

export default class RequestPasswordResetUseCase
  implements IUseCase<RequestPasswordResetDto, AccessToken>
{
  constructor(readonly repository: IUserRepository) {}

  @Validate(requestPasswordResetDtoSchema)
  async execute(data: RequestPasswordResetDto): Promise<AccessToken> {
    const { email } = data;

    const user = await this.repository.findByEmail(email);

    if (!user) throw NotFound("user not found");

    const accessToken = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        roles: [JWT_ROLES.RESET_PASSWORD],
      },
      String(process.env.JWT_SECRET),
      {
        expiresIn: String(process.env.JWT_RESET_PASSWORD_EXPIRES_IN),
      }
    );

    return {
      token: accessToken,
    };
  }
}
