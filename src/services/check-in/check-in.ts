import { CheckInsRepository } from '@/repositories/check-ins-repository.types';
import { GymsRepository } from '@/repositories/gyms-repository.types';
import { CheckIn } from '@prisma/client';
import { ResourceNotFoundError } from '../errors/resource-not-found-error';
import { getDistanceBetweenCoordinates } from '../utils/getDistanceBetweenCoordinates';
import { InvalidCheckInError } from '../errors/invalid-check-in-error';

interface CheckInServiceRequest {
  userId: string;
  gymId: string;
  userLatitude: number;
  userLongitude: number;
}

interface CheckInServiceResponse {
  checkIn: CheckIn;
}

export class CheckInService {
  constructor(
    private checkInsRepository: CheckInsRepository,
    private gymsRepository: GymsRepository
  ) {}

  async execute({
    gymId,
    userId,
    userLatitude,
    userLongitude
  }: CheckInServiceRequest): Promise<CheckInServiceResponse> {
    const MAX_DISTANCE = 0.1; // 100 meters
    const gym = await this.gymsRepository.findById(gymId);

    if (!gym) {
      throw new ResourceNotFoundError();
    }

    const distance = getDistanceBetweenCoordinates(
      {
        latitude: userLatitude,
        longitude: userLongitude
      },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber()
      }
    );

    if (distance > MAX_DISTANCE) {
      throw new InvalidCheckInError('Max distance reached.');
    }

    const checkInOnSameDate = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date()
    );

    if (checkInOnSameDate) {
      throw new InvalidCheckInError('User already checked in today.');
    }

    const checkIn = await this.checkInsRepository.create({
      gym_id: gymId,
      user_id: userId
    });

    return { checkIn };
  }
}
