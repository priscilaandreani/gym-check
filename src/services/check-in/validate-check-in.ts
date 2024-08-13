import { CheckInsRepository } from '@/repositories/check-ins-repository.types';
import { CheckIn } from '@prisma/client';
import { ResourceNotFoundError } from '../errors/resource-not-found-error';
import dayjs from 'dayjs';
import { InvalidCheckInError } from '../errors/invalid-check-in-error';

interface ValidateCheckInServiceRequest {
  checkInId: string;
}

interface ValidateCheckInServiceResponse {
  checkIn: CheckIn;
}

export class ValidateCheckInService {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    checkInId
  }: ValidateCheckInServiceRequest): Promise<ValidateCheckInServiceResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId);
    const MAX_TIME_AFTER_CREATION = 20; // minutes

    if (!checkIn) {
      throw new ResourceNotFoundError();
    }

    const timeAfterCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      'minutes'
    );

    if (timeAfterCreation > MAX_TIME_AFTER_CREATION) {
      throw new InvalidCheckInError('The checkin is expired');
    }

    checkIn.validated_at = new Date();

    await this.checkInsRepository.save(checkIn);

    return { checkIn };
  }
}
