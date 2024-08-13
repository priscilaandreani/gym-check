import { GymsRepository } from '@/repositories/gyms-repository.types';
import { Gym } from '@prisma/client';

interface CreateGymServiceRequest {
  name: string;
  description: string | null;
  latitude: number;
  longitude: number;
}

interface CreateGymServiceResponse {
  gym: Gym;
}

export class CreateGymService {
  constructor(private gymsRespository: GymsRepository) {}

  async execute({
    name,
    description,
    latitude,
    longitude
  }: CreateGymServiceRequest): Promise<CreateGymServiceResponse> {
    const gym = await this.gymsRespository.create({
      name,
      description,
      latitude,
      longitude
    });

    return { gym };
  }
}
