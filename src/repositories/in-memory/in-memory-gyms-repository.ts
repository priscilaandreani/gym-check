import { Gym, Prisma } from '@prisma/client';
import { GymsRepository } from '../gyms-repository.types';
import { randomUUID } from 'node:crypto';

export class InMemoryGymsRepository implements GymsRepository {
  public gyms: Gym[] = [];

  async findById(id: string): Promise<Gym | null> {
    const gym = this.gyms.find((gym) => gym.id === id);

    if (!gym) {
      return null;
    }

    return gym;
  }

  async search(query: string, page: number): Promise<Gym[] | []> {
    return this.gyms
      .filter((gym) => gym.name.includes(query) || gym.id === query)
      .slice((page - 1) * 20, page * 20);
  }

  async create(data: Prisma.GymCreateInput): Promise<Gym> {
    const gym: Gym = {
      id: randomUUID(),
      name: data.name,
      description: data.description ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString())
    };

    this.gyms.push(gym);

    return gym;
  }
}
