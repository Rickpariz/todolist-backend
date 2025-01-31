import { IUseCase } from "../../../../shared/domain/usecase";
import { User } from "../../domain/entities/user.entity";
import {
  createUserDtoSchema,
  CreateUserUseCaseDto,
} from "../../infrastructure/dtos/create-user.dto";
import { Validate } from "../../../../shared/infrastructure/decorators/validation.decorator";
import { hashSync } from "../../../../shared/application/hash";
import { IUserRepository } from "../../domain/repositories/user-repository.interface";
import { Conflict } from "../../../../shared/infrastructure/http/responses";

export default class CreateUserUseCase
  implements IUseCase<CreateUserUseCaseDto, User>
{
  constructor(readonly repository: IUserRepository) {}

  @Validate(createUserDtoSchema)
  async execute(data: CreateUserUseCaseDto): Promise<User> {
    const { name, email, password } = data;

    const exists = await this.repository.exists({ email });

    if (exists) {
      throw Conflict("User with this email already exists");
    }

    const passwordHash = hashSync(password);

    const user = await this.repository.create({
      name,
      email,
      password: passwordHash,
    });

    return user;
  }
}
