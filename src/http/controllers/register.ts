import { z } from 'zod';
import { FastifyReply, FastifyRequest } from 'fastify';
import { RegisterService } from '@/services/register';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { UserAlreadyExistsError } from '@/services/errors/user-already-exists-error';

export async function register(req: FastifyRequest, res: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6)
  });

  const { name, email, password } = registerBodySchema.parse(req.body);

  try {
    const usersRespository = new PrismaUsersRepository();
    const registerService = new RegisterService(usersRespository);

    registerService.execute({
      name,
      email,
      password
    });
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return res.status(409).send({ message: err.message });
    }

    return res.status(500).send(); // TODO: improve error handling
  }

  return res.status(201).send();
}
