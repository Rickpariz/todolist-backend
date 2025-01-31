import { IUseCase } from "../../../../shared/domain/usecase";
import { Validate } from "../../../../shared/infrastructure/decorators/validation.decorator";
import { hashSync } from "../../../../shared/application/hash";
import * as jwt from "jsonwebtoken";

import { User } from "../../../users/domain/entities/user.entity";
import { JWT_ROLES } from "../../../../shared/domain/enums/jwt-roles";
import {
  ResetPasswordDto,
  resetPasswordDtoSchema,
} from "../../infrastructure/dtos/reset-password.dto";
import { IUserRepository } from "../../../users/domain/repositories/user-repository.interface";
import {
  NotFound,
  Unauthorized,
} from "../../../../shared/infrastructure/http/responses";

export default class ResetPasswordUsecase
  implements IUseCase<ResetPasswordDto, User>
{
  constructor(readonly repository: IUserRepository) {}

  @Validate(resetPasswordDtoSchema)
  async execute(data: ResetPasswordDto): Promise<User> {
    const { password, token } = data;

    let decoded;

    try {
      decoded = jwt.verify(
        token,
        String(process.env.JWT_SECRET)
      ) as jwt.JwtPayload;
    } catch (err) {
      throw Unauthorized();
    }

    const { id, roles } = decoded;

    if (!roles || !roles.includes(JWT_ROLES.RESET_PASSWORD))
      throw Unauthorized();

    const user = await this.repository.exists({ id });

    if (!user) throw NotFound("user not found");

    const passwordHash = hashSync(password);

    const userUpdated = await this.repository.update({
      id,
      password: passwordHash,
    });

    return userUpdated;
  }
}
