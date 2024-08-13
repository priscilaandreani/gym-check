import { CheckInsRepository } from '@/repositories/check-ins-repository.types';

interface GetUserMetricsCheckInServiceRequest {
  userId: string;
}

interface GetUserMetricsCheckInServiceResponse {
  checkInsMetric: number;
}

export class GetUserMetricsCheckInService {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId
  }: GetUserMetricsCheckInServiceRequest): Promise<GetUserMetricsCheckInServiceResponse> {
    const checkInsMetric = await this.checkInsRepository.countByUserId(userId);

    return {
      checkInsMetric
    };
  }
}
