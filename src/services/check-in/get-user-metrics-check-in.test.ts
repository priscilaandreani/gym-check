import { describe, expect, it, beforeEach } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';

import { GetUserMetricsCheckInService } from './get-user-metrics-check-in';

let checkInsRepository: InMemoryCheckInsRepository;
let sut: GetUserMetricsCheckInService;

describe('GetUserMetricsCheckInService', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new GetUserMetricsCheckInService(checkInsRepository);
  });

  it('should be able to get users check-ins metrics', async () => {
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

    const { checkInsMetric } = await sut.execute({
      userId: 'user-id'
    });

    expect(checkInsMetric).toEqual(2);
  });
});
