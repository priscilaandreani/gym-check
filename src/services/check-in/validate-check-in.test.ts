import { describe, expect, it, beforeEach, vi, afterEach } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { ValidateCheckInService } from './validate-check-in';
import { CheckIn } from '@prisma/client';
import { ResourceNotFoundError } from '../errors/resource-not-found-error';
import { InvalidCheckInError } from '../errors/invalid-check-in-error';

let checkInsRepository: InMemoryCheckInsRepository;
let sut: ValidateCheckInService;

describe('checkIn service', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new ValidateCheckInService(checkInsRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
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

  it('should not be able to validate the check-in ater 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2024, 0, 1, 13, 40)); // 01-01-2024 13:40
    const TWENTY_ONE_MINUTES = 21 * 60 * 1000; //ms

    const createdCheckIn: CheckIn = await checkInsRepository.create({
      gym_id: 'gym-id',
      user_id: 'user-id'
    });

    vi.advanceTimersByTime(TWENTY_ONE_MINUTES);

    await expect(() =>
      sut.execute({
        checkInId: createdCheckIn.id
      })
    ).rejects.toBeInstanceOf(InvalidCheckInError);
  });
});
