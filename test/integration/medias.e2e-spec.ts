import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import { cleanDb } from './helpers';
import { createMedia } from '../factories/medias-factory';

describe('Medias (e2e)', () => {
  let app: INestApplication;
  let server: request.SuperTest<request.Test>;
  const prisma: PrismaService = new PrismaService();

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prisma)
      .compile();

    app = moduleFixture.createNestApplication();
    //prisma = await moduleFixture.resolve(PrismaService);
    app.useGlobalPipes(new ValidationPipe());
    await cleanDb(prisma);
    server = request(app.getHttpServer());
    await app.init();
  });

  describe('POST /medias', () => {
    beforeEach(async () => {
      await cleanDb(prisma);
    });

    it('return status code 400 if body invalid', async () => {
      const media = await createMedia(prisma);
      const { statusCode } = await server
        .post('/medias')
        .send({ title: media.title });
      expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
    });

    it('return status code 409 whem title and username already exist', async () => {
      const media = await createMedia(prisma);
      const { statusCode } = await server
        .post('/medias')
        .send({ title: media.title, username: media.username });
      expect(statusCode).toBe(HttpStatus.CONFLICT);
      const mediasCount = await prisma.media.count();
      expect(mediasCount).toBe(1);
    });

    it('return status code 201 whem create a new media', async () => {
      const { statusCode } = await server
        .post('/medias')
        .send({ title: 'FaceBook', username: 'Jason' });
      expect(statusCode).toBe(HttpStatus.CREATED);
      const returnMedia = await prisma.media.findFirst();
      expect(returnMedia).not.toBe(null);
    });
  });
});
