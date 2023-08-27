import { Injectable } from '@nestjs/common';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PublicationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(body: CreatePublicationDto) {
    return await this.prisma.publication.create({
      data: body,
    });
  }

  async findAll() {
    return await this.prisma.publication.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.publication.findUnique({
      where: { id },
    });
  }

  async update(id: number, body: UpdatePublicationDto) {
    return await this.prisma.publication.update({
      where: { id },
      data: body,
    });
  }

  async remove(id: number) {
    return `This action removes a #${id} publication`;
  }
}
