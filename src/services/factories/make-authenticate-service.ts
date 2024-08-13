import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { AuthenticateService } from '../authenticate/authenticate';

export function makeAuthenticateService(): AuthenticateService {
  const usersRespository = new PrismaUsersRepository();
  const registerService = new AuthenticateService(usersRespository);

  return registerService;
}
