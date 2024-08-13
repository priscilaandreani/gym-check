import { describe, expect, it, beforeEach } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';

import { FetchUserCheckInsHistoryService } from './fetch-user-check-ins-history';

let checkInsRepository: InMemoryCheckInsRepository;
let sut: FetchUserCheckInsHistoryService;

describe('Fetch User CheckIns History Service', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new FetchUserCheckInsHistoryService(checkInsRepository);
  });

  it("should be able to get all user's check-ins", async () => {
    await checkInsRepository.create({
      user_id: 'user-id',
      gym_id: 'gym-id_01',
      validated_at: new Date()
    });

    await checkInsRepository.create({
      user_id: 'user-id',
      gym_id: 'gym-id_02',
      validated_at: new Date()
    });

    const { checkInsHistory } = await sut.execute({
      userId: 'user-id',
      page: 1
    });

    expect(checkInsHistory).toHaveLength(2);
    expect(checkInsHistory).toEqual([
      expect.objectContaining({ gym_id: 'gym-id_01' }),
      expect.objectContaining({ gym_id: 'gym-id_02' })
    ]);
  });

  it('should be able to fetch paginated check-ins', async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInsRepository.create({
        gym_id: `gym-${i}`,
        user_id: 'user-01'
      });
    }

    const { checkInsHistory } = await sut.execute({
      userId: 'user-01',
      page: 2
    });

    expect(checkInsHistory).toHaveLength(2);
    expect(checkInsHistory).toEqual([
      expect.objectContaining({ gym_id: 'gym-21' }),
      expect.objectContaining({ gym_id: 'gym-22' })
    ]);
  });
});
