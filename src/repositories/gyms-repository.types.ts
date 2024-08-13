import { Gym, Prisma } from '@prisma/client';

export interface FindByLocationParams {
  latitude: number;
  longitude: number;
}
export interface GymsRepository {
  findById(id: string): Promise<Gym | null>;
  findByLocation({ latitude, longitude }: FindByLocationParams): Promise<Gym[]>;
  create(data: Prisma.GymCreateInput): Promise<Gym>;
  search(query: string, page: number): Promise<Gym[] | []>;
}
