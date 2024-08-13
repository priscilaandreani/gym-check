import { z } from 'zod';
import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthenticateService } from '@/services/authenticate/authenticate';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { InvalidCredentialsError } from '@/services/errors/invalid-credentials-error';

export async function authenticate(req: FastifyRequest, res: FastifyReply) {
  const authenticateBodySchema = z.object({
    password: z.string(),
    email: z.string().email()
  });

  const { password, email } = authenticateBodySchema.parse(req.body);

  try {
    const usersRespository = new PrismaUsersRepository();
    const authenticateService = new AuthenticateService(usersRespository);

    await authenticateService.execute({
      password,
      email
    });
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return res.status(400).send({ message: err.message });
    }

    throw err;
  }

  return res.status(200).send();
}
