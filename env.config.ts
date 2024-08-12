import * as env from 'env-var';

const config = {
  port: env.get('PORT').default(3333).required().asPortNumber(),
  nodeEnv: env
    .get('NODE_ENV')
    .required()
    .default('development')
    .asEnum(['development', 'production', 'test']),
  database: env.get('DATABASE_URL').required().asString()
};

export default config;
