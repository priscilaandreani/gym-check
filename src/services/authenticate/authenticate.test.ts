import { describe, expect, it } from 'vitest';
import { AuthenticateService } from './authenticate';
import { hash } from 'bcryptjs';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { InvalidCredentialsError } from '../errors/invalid-credentials-error';

describe('authenticate service', () => {
  it('should be able to authenticate', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateService(usersRepository);

    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('Password@123', 6)
    });

    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      password: 'Password@123'
    });

    expect(user).toHaveProperty('id');
    expect(user.id).toEqual(expect.any(String));
  });

  it('should not be able to authenticate with wrong email', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateService(usersRepository);

    await expect(() =>
      sut.execute({
        email: 'john@example.com',
        password: 'Password@123'
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateService(usersRepository);

    await expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        password: 'Password@'
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
