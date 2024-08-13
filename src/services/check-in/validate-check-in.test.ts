import { describe, expect, it, beforeEach } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { ValidateCheckInService } from './validate-check-in';
import { CheckIn } from '@prisma/client';
import { ResourceNotFoundError } from '../errors/resource-not-found-error';

let checkInsRepository: InMemoryCheckInsRepository;
let sut: ValidateCheckInService;

describe('checkIn service', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new ValidateCheckInService(checkInsRepository);
  });

  it('should be able to validate check in', async () => {
    const createdCheckIn: CheckIn = await checkInsRepository.create({
      gym_id: 'gym-id',
      user_id: 'user-id'
    });

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id
    });

    expect(checkIn.validated_at).toEqual(expect.any(Date));
    expect(checkInsRepository.checkIns[0].validated_at).toEqual(
      expect.any(Date)
    );
  });

  it('should not be able to validate an inexistent check in', async () => {
    await expect(() =>
      sut.execute({
        checkInId: 'non'
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
