import { CheckInsRepository } from '@/repositories/check-ins-repository.types';
import { CheckIn } from '@prisma/client';

interface CheckInServiceRequest {
  userId: string;
  gymId: string;
}

interface CheckInServiceResponse {
  checkIn: CheckIn;
}

export class CheckInService {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    gymId,
    userId
  }: CheckInServiceRequest): Promise<CheckInServiceResponse> {
    const checkInOnSameDate = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date()
    );

    if (checkInOnSameDate) {
      throw new Error();
    }

    const checkIn = await this.checkInsRepository.create({
      gym_id: gymId,
      user_id: userId
    });

    return { checkIn };
  }
}
