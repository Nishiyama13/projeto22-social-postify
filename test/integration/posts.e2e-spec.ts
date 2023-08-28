import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import { cleanDb } from './helpers';
import { createPost } from '../factories/posts-factory';

describe('Posts (e2e)', () => {
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

  describe('POST /posts', () => {
    beforeEach(async () => {
      await cleanDb(prisma);
    });

    it('return status code 400 if body invalid', async () => {
      const post = await createPost(prisma);
      const { statusCode } = await server
        .post('/posts')
        .send({ title: post.title });
      expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
    });

    it('return status code 201 whem create a new media', async () => {
      const { statusCode } = await server.post('/posts').send({
        title: 'Sextou',
        text: 'E ai Gurizess, hoje tem!!!',
        image: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww',
      });
      expect(statusCode).toBe(HttpStatus.CREATED);
      const returnMedia = await prisma.post.findFirst();
      expect(returnMedia).not.toBe(null);
    });
  });
});
