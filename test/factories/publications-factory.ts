import { faker } from '@faker-js/faker';
import { PrismaService } from '../../src/prisma/prisma.service';
import { createMedia } from './medias-factory';
import { createPost } from './posts-factory';

export async function createFuturePublication(prisma: PrismaService) {
  const media = await createMedia(prisma);
  const post = await createPost(prisma);
  return prisma.publication.create({
    data: {
      mediaId: media.id,
      postId: post.id,
      date: faker.date.future({ years: 1 }),
    },
  });
}

export async function createPastPublication(prisma: PrismaService) {
  const media = await createMedia(prisma);
  const post = await createPost(prisma);
  return prisma.publication.create({
    data: {
      mediaId: media.id,
      postId: post.id,
      date: faker.date.past({ years: 1 }),
    },
  });
}
