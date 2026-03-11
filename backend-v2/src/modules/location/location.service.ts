import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class LocationService {
  constructor(private prisma: PrismaService) {}

  async getUserLocations(userId: string) {
    return this.prisma.userLocation.findMany({
      where: { userId },
      include: { location: true },
    });
  }

  async selectActiveLocation(userId: string, locationId: string) {
    // Перевіряємо, що користувач має доступ до цієї локації
    const userLocation = await this.prisma.userLocation.findUnique({
      where: {
        userId_locationId: { userId, locationId },
      },
      include: { location: true },
    });

    if (!userLocation) {
      throw new ForbiddenException('You do not have access to this location');
    }

    // Повертаємо локацію (на фронтенді можна зберігати у JWT / local state)
    return userLocation.location;
  }

  async getLocationsByTenant(tenantId: string) {
    return this.prisma.location.findMany({
      where: { tenantId, deletedAt: null },
    });
  }

  async createLocation(
    tenantId: string,
    name: string,
    address?: string,
    photoUrl?: string,
  ) {
    return this.prisma.location.create({
      data: {
        tenantId,
        name,
        address,
        photoUrl,
      },
    });
  }

  async assignUserToLocation(userId: string, locationId: string) {
    return this.prisma.userLocation.upsert({
      where: { userId_locationId: { userId, locationId } },
      update: {},
      create: { userId, locationId },
    });
  }
}
