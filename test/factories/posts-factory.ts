import { faker } from '@faker-js/faker';
import { PrismaService } from '../../src/prisma/prisma.service';

export async function createPost(prisma: PrismaService) {
  return prisma.post.create({
    data: {
      title: faker.lorem.sentence(),
      text: faker.lorem.text(),
      image: faker.image.url(),
    },
  });
}
