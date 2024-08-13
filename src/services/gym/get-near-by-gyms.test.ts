import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { GetNearByService } from './get-near-by-gyms';

let sut: GetNearByService;
let gymsRepository: InMemoryGymsRepository;

describe('get nearby gyms service', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new GetNearByService(gymsRepository);

    await gymsRepository.create({
      name: 'Gym Near',
      description: 'Gym Description',
      latitude: -23.5668582,
      longitude: -46.660879
    });

    await gymsRepository.create({
      name: 'Gym Far',
      description: 'Gym Description',
      latitude: -23.5,
      longitude: -46.6
    });
  });

  it('should be able to get nearby gyms', async () => {
    const { gyms } = await sut.execute({
      userLatitude: -23.5668582,
      userLongitude: -46.660879
    });

    expect(gyms).toHaveLength(1);
    expect(gyms[0].name).toBe('Gym Near');
  });
});
