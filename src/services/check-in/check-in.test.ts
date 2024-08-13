import { describe, expect, it, beforeEach, vi, afterEach } from 'vitest';
import { CheckInService } from '@/services/check-in/check-in';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';

let checkInsRepository: InMemoryCheckInsRepository;
let sut: CheckInService;

describe('checkIn service', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new CheckInService(checkInsRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-id',
      userId: 'user-id'
    });

    expect(checkIn).toHaveProperty('id');
    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check in twice a day', async () => {
    vi.setSystemTime(new Date(2024, 7, 13, 0, 0, 0));
    await sut.execute({
      gymId: 'gym-id',
      userId: 'user-id'
    });

    await expect(() =>
      sut.execute({
        gymId: 'gym-id',
        userId: 'user-id'
      })
    ).rejects.toBeInstanceOf(Error);
  });

  it('should be able to check in different day', async () => {
    vi.setSystemTime(new Date(2024, 7, 13));

    await sut.execute({
      gymId: 'gym-id',
      userId: 'user-id'
    });

    vi.setSystemTime(new Date(2024, 8, 13));

    const { checkIn } = await sut.execute({
      gymId: 'gym-id',
      userId: 'user-id'
    });

    expect(checkIn).toHaveProperty('id');
    expect(checkIn.id).toEqual(expect.any(String));
  });
});
