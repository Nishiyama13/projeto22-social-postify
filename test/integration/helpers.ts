import { PrismaService } from '../../src/prisma/prisma.service';

export async function cleanDb(prisma: PrismaService) {
  await prisma.publication.deleteMany();
  await prisma.media.deleteMany();
  await prisma.post.deleteMany();
}
