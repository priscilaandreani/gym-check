import { describe, expect, it, beforeEach, vi, afterEach } from 'vitest';
import { CheckInService } from '@/services/check-in/check-in';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { Decimal } from '@prisma/client/runtime/library';
import { InvalidCheckInError } from '../errors/invalid-check-in-error';

let checkInsRepository: InMemoryCheckInsRepository;
let sut: CheckInService;
let gymsRepository: InMemoryGymsRepository;
let gymId: string;

describe('checkIn service', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInService(checkInsRepository, gymsRepository);

    vi.useFakeTimers();
    const { id } = await gymsRepository.create({
      name: 'Gym Name',
      description: '',
      latitude: new Decimal(userLatitude),
      longitude: new Decimal(userLongitude)
    });

    gymId = id;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const userLatitude = -23.5668582;
  const userLongitude = -46.660879;

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId,
      userId: 'user-id',
      userLatitude,
      userLongitude
    });

    expect(checkIn).toHaveProperty('id');
    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check in twice a day', async () => {
    vi.setSystemTime(new Date(2024, 7, 13, 0, 0, 0));
    await sut.execute({
      gymId,
      userId: 'user-id',
      userLatitude,
      userLongitude
    });

    await expect(() =>
      sut.execute({
        gymId,
        userId: 'user-id',
        userLatitude,
        userLongitude
      })
    ).rejects.toBeInstanceOf(InvalidCheckInError);
  });

  it('should be able to check in different day', async () => {
    vi.setSystemTime(new Date(2024, 7, 13));

    await sut.execute({
      gymId,
      userId: 'user-id',
      userLatitude,
      userLongitude
    });

    vi.setSystemTime(new Date(2024, 8, 13));

    const { checkIn } = await sut.execute({
      gymId,
      userId: 'user-id',
      userLatitude,
      userLongitude
    });

    expect(checkIn).toHaveProperty('id');
    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.gyms.push({
      id: 'gym-id_02',
      name: 'Gym Name',
      description: '',
      latitude: new Decimal(-23.0),
      longitude: new Decimal(-46.0)
    });

    await expect(() =>
      sut.execute({
        gymId: 'gym-id_02',
        userId: 'user-id',
        userLatitude,
        userLongitude
      })
    ).rejects.toBeInstanceOf(InvalidCheckInError);
  });
});
