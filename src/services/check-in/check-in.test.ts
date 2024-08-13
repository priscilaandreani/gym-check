import { describe, expect, it, beforeEach } from 'vitest';
import { CheckInService } from '@/services/check-in/check-in';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';

let checkInsRepository: InMemoryCheckInsRepository;
let sut: CheckInService;

describe('checkIn service', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new CheckInService(checkInsRepository);
  });

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-id',
      userId: 'user-id'
    });

    expect(checkIn).toHaveProperty('id');
    expect(checkIn.id).toEqual(expect.any(String));
  });
});
