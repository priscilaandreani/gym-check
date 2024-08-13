import { GymsRepository } from '@/repositories/gyms-repository.types';
import { Gym } from '@prisma/client';

interface GetNearByServiceRequest {
  userLatitude: number;
  userLongitude: number;
}

interface GetNearByServiceResponse {
  gyms: Gym[];
}

export class GetNearByService {
  constructor(private gymsRespository: GymsRepository) {}

  async execute({
    userLatitude,
    userLongitude
  }: GetNearByServiceRequest): Promise<GetNearByServiceResponse> {
    const gyms = await this.gymsRespository.findByLocation({
      latitude: userLatitude,
      longitude: userLongitude
    });

    return { gyms };
  }
}
