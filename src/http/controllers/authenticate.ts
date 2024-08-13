import { z } from 'zod';
import { FastifyReply, FastifyRequest } from 'fastify';
import { InvalidCredentialsError } from '@/services/errors/invalid-credentials-error';
import { makeAuthenticateService } from '@/services/factories/make-authenticate-service';

export async function authenticate(req: FastifyRequest, res: FastifyReply) {
  const authenticateBodySchema = z.object({
    password: z.string(),
    email: z.string().email()
  });

  const { password, email } = authenticateBodySchema.parse(req.body);

  try {
    const authenticateService = makeAuthenticateService();

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
