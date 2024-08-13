import { describe, expect, it, beforeEach } from 'vitest';
import { RegisterService } from '@/services/register/register';
import { compare } from 'bcryptjs';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { UserAlreadyExistsError } from '../errors/user-already-exists-error';

let usersRepository: InMemoryUsersRepository;
let sut: RegisterService;

describe('register service', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterService(usersRepository);
  });

  it('should be able to register a new user', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'Password@123'
    });

    expect(user).toHaveProperty('id');
    expect(user.id).toEqual(expect.any(String));
  });

  it('should hash user password upon registration', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const sut = new RegisterService(usersRepository);

    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'Password@123'
    });

    const isPasswordCorretlyHashed = await compare(
      'Password@123',
      user.password_hash
    );

    expect(isPasswordCorretlyHashed).toBe(true);
  });

  it('should not be able to register a user with an already registered email', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const sut = new RegisterService(usersRepository);

    const email = 'johndoe@example.com';

    await sut.execute({
      name: 'John Doe',
      email: email,
      password: 'Password@123'
    });

    await expect(() =>
      sut.execute({
        name: 'John Doe',
        email: email,
        password: 'Password@123'
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
