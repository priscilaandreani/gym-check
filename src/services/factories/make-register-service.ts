import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { RegisterService } from '../register/register';

export function makeRegisterService(): RegisterService {
  const usersRespository = new PrismaUsersRepository();
  const registerService = new RegisterService(usersRespository);

  return registerService;
}
