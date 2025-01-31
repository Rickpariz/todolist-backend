import { IUseCase } from "../../../../shared/domain/usecase";
import {
  updateUserDtoSchema,
  UpdateUserUseCaseDto,
} from "../../infrastructure/dtos/update-user.dto";
import { User } from "../../domain/entities/user.entity";
import { IUserRepository } from "../../domain/repositories/user-repository.interface";
import { Validate } from "../../../../shared/infrastructure/decorators/validation.decorator";
import {
  Conflict,
  NotFound,
  Unauthorized,
} from "../../../../shared/infrastructure/http/responses";

export default class UpdateUserUseCase
  implements IUseCase<UpdateUserUseCaseDto, User>
{
  constructor(readonly repository: IUserRepository) {}

  @Validate(updateUserDtoSchema)
  async execute(data: UpdateUserUseCaseDto): Promise<User> {
    const { id, tokenUser, ...dto } = data;

    if (id !== tokenUser.id) throw Unauthorized();

    const exists = await this.repository.exists({ id });

    if (!exists) throw NotFound("user not found");

    if (dto.email) {
      await this.validateDuplicatedEmail(data);
    }

    const user = await this.repository.update({
      id,
      ...dto,
    });

    return user;
  }

  async validateDuplicatedEmail(data: UpdateUserUseCaseDto) {
    const { id, email } = data;

    const isDuplicated = await this.repository.isDuplicateEmail({
      email: email!,
      id,
    });

    if (isDuplicated) {
      throw Conflict("User with this email already exists");
    }
  }
}
