import { UsersRepository } from '@/repositories/users-repository.types';
import { hash } from 'bcryptjs';
import { UserAlreadyExistsError } from '../errors/user-already-exists-error';
import { User } from '@prisma/client';

interface RegisterServiceRequest {
  password: string;
  email: string;
  name: string;
}

interface RegisterServiceResponse {
  user: User;
}

export class RegisterService {
  constructor(private usersRespository: UsersRepository) {}

  async execute({
    password,
    email,
    name
  }: RegisterServiceRequest): Promise<RegisterServiceResponse> {
    const passwordHash = await hash(password, 6);
    const duplicatedEmail = await this.usersRespository.findByEmail(email);

    if (duplicatedEmail) {
      throw new UserAlreadyExistsError();
    }

    const user = await this.usersRespository.create({
      email,
      name,
      password_hash: passwordHash
    });

    return { user };
  }
}
