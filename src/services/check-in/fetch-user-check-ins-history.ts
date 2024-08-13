import { CheckInsRepository } from '@/repositories/check-ins-repository.types';
import { CheckIn } from '@prisma/client';

interface FetchUserCheckInsHistoryServiceRequest {
  userId: string;
  page: number;
}

interface FetchUserCheckInsHistoryServiceResponse {
  checkInsHistory: CheckIn[];
}

export class FetchUserCheckInsHistoryService {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
    page
  }: FetchUserCheckInsHistoryServiceRequest): Promise<FetchUserCheckInsHistoryServiceResponse> {
    const checkInsHistory = await this.checkInsRepository.findManyByUserId(
      userId,
      page
    );

    return {
      checkInsHistory
    };
  }
}
