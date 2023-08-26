import { Injectable } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MediasRepository {
  [x: string]: any;
  constructor(private readonly prisma: PrismaService) {}

  async create(body: CreateMediaDto) {
    return await this.prisma.media.create({
      data: body,
    });
  }

  async findAll() {
    return await this.prisma.media.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.media.findFirst({
      where: { id },
    });
  }

  async findByTitleAndUsername(title: string, username: string) {
    return this.prisma.media.findFirst({
      where: {
        title: title,
        username: username,
      },
    });
  }

  async update(id: number, body: UpdateMediaDto) {
    return await this.prisma.media.update({
      where: { id },
      data: body,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} media`;
  }
}