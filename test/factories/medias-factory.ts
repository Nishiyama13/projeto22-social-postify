import { faker } from '@faker-js/faker';
import { PrismaService } from '../../src/prisma/prisma.service';

export async function createMedia(prisma: PrismaService) {
  return prisma.media.create({
    data: {
      title: 'Instagram',
      username: faker.internet.userName(),
    },
  });
}
