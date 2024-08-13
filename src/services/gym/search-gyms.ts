import { GymsRepository } from '@/repositories/gyms-repository.types';
import { Gym } from '@prisma/client';

interface SearchGymServiceRequest {
  query: string;
  page: number;
}

interface SearchGymServiceResponse {
  gyms: Gym[];
}

export class SearchGymService {
  constructor(private gymsRespository: GymsRepository) {}

  async execute({
    query,
    page
  }: SearchGymServiceRequest): Promise<SearchGymServiceResponse> {
    const gyms = await this.gymsRespository.search(query, page);

    return { gyms };
  }
}
