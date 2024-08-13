import { beforeEach, describe, expect, it } from 'vitest';
import { CreateGymService } from '@/services/gym/create-gym';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';

let sut: CreateGymService;
let gymsRepository: InMemoryGymsRepository;

describe('create gym service', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymService(gymsRepository);
  });

  it('should be able to create a gym', async () => {
    const { gym } = await sut.execute({
      name: 'Gym Name',
      description: 'Gym Description',
      latitude: -23.5668582,
      longitude: -46.660879
    });

    expect(gym).toHaveProperty('id');
  });
});
