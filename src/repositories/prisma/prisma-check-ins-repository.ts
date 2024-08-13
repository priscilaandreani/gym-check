import { prisma } from '@/lib/prisma';
import { CheckIn, Prisma } from '@prisma/client';
import { CheckInsRepository } from '../check-ins-repository.types';

export class PrismaCheckInsRepository implements CheckInsRepository {
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkIn = prisma.checkIn.create({
      data
    });

    return checkIn;
  }
}
