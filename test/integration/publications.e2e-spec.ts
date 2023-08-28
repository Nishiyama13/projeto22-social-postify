import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import { cleanDb } from './helpers';
import { createFuturePublication } from '../factories/publications-factory';
import { createMedia } from '../factories/medias-factory';
import { createPost } from '../factories/posts-factory';

describe('Publications (e2e)', () => {
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

  describe('POST /publications', () => {
    beforeEach(async () => {
      await cleanDb(prisma);
    });

    it('return status code 400 if body invalid', async () => {
      const publication = await createFuturePublication(prisma);
      const { statusCode } = await server
        .post('/publications')
        .send({ mediaId: publication.mediaId });
      expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
    });

    it('return status code 404 whem mediaId dosent exist', async () => {
      const post = await createPost(prisma);
      const { statusCode } = await server.post('/publications').send({
        mediaId: 0,
        postId: post.id,
        date: new Date(),
      });
      expect(statusCode).toBe(HttpStatus.NOT_FOUND);
    });

    it('return status code 404 whem postId dosent exist', async () => {
      const media = await createMedia(prisma);
      const { statusCode } = await server.post('/publications').send({
        mediaId: media.id,
        postId: 0,
        date: new Date(),
      });
      expect(statusCode).toBe(HttpStatus.NOT_FOUND);
    });

    it('return status code 201 whem create a new publication', async () => {
      //const media = await createMedia(prisma);
      //const post = await createPost(prisma);
      const publication = await createFuturePublication(prisma);
      const { statusCode } = await server.post('/publications').send({
        mediaId: publication.mediaId,
        postId: publication.postId,
        date: publication.date,
      });
      expect(statusCode).toBe(HttpStatus.CREATED);
      const returnMedia = await prisma.publication.findFirst();
      expect(returnMedia).not.toBe(null);
    });
  });
});
