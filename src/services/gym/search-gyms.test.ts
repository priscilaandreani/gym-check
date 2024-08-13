import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { SearchGymService } from './search-gyms';

let sut: SearchGymService;
let gymsRepository: InMemoryGymsRepository;

describe('seatch gym service', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymService(gymsRepository);

    await gymsRepository.create({
      name: 'Gym Default',
      description: 'Gym Description',
      latitude: -23.5668582,
      longitude: -46.660879
    });
  });

  it('should be able to search a gym by name', async () => {
    const { gyms } = await sut.execute({
      query: 'Gym Default',
      page: 1
    });

    expect(gyms).toHaveLength(1);
    expect(gyms[0].name).toBe('Gym Default');
  });

  it('should be able to search a gym by id', async () => {
    const { id } = await gymsRepository.create({
      name: 'Gym Name',
      description: 'Gym Description',
      latitude: -23.5668582,
      longitude: -46.660879
    });

    const { gyms } = await sut.execute({
      query: id,
      page: 1
    });

    expect(gyms).toHaveLength(1);
    expect(gyms[0].id).toBe(id);
  });

  it('should be able to fetch gym search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        name: 'SmartFit ' + i,
        description: '',
        latitude: -23.5668582,
        longitude: -46.660879
      });
    }

    const { gyms } = await sut.execute({
      query: 'SmartFit ',
      page: 2
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ name: 'SmartFit 21' }),
      expect.objectContaining({ name: 'SmartFit 22' })
    ]);
  });
});
