import fastify from 'fastify';
import { appRoutes } from './http/routes';
import { ZodError } from 'zod';

export const app = fastify();

app.register(appRoutes);

app.setErrorHandler((error, req, reply) => {
  if (error instanceof ZodError) {
    reply
      .status(400)
      .send({ message: 'Validation error.', details: error.format() });
  }

  if (process.env.NODE_ENV !== 'production') {
    console.error(error);
  } else {
    //TODO: newlic.log(error);
  }

  reply.status(500).send({ message: 'Internal server error.' });
});
