import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { Media } from '@prisma/client';
import { MediasRepository } from './medias.repository';
import { IdNotFoundException } from '../exceptions/id-not-found.exception';
import { DuplicateDataException } from '../exceptions/duplicate-data.exception';

@Injectable()
export class MediasService {
  private medias: Media[];

  constructor(private readonly repository: MediasRepository) {}

  async create(body: CreateMediaDto) {
    const checkMedia = await this.repository.findByTitleAndUsername(
      body.title,
      body.username,
    );

    if (checkMedia) {
      throw new DuplicateDataException(body.title, body.username);
    }

    return await this.repository.create(body);
  }

  async findAll() {
    return await this.repository.findAll();
  }

  async findOne(id: number) {
    const mediaById = await this.repository.findOne(id);
    if (!mediaById || !id || id <= 0) {
      throw new IdNotFoundException(id);
    }
    return await this.repository.findOne(id);
  }

  async update(id: number, body: UpdateMediaDto) {
    const mediaById = await this.repository.findOne(id);
    if (!mediaById || !id || id <= 0) {
      throw new IdNotFoundException(id);
    }
    const checkMedia = await this.repository.findByTitleAndUsername(
      body.title,
      body.username,
    );

    if (checkMedia) {
      throw new DuplicateDataException(body.title, body.username);
    }

    return this.repository.update(id, body);
  }

  remove(id: number) {
    return `This action removes a #${id} media`;
  }

  generateError() {
    //throw new Error('Erro ai pra implementar');   //ou
    //throw new HttpException('Fui tratado na Service', HttpStatus.UNAUTHORIZED);   //ou
    throw new NotFoundException('Não achei (Service)'); //Filtro global
  }
}
//fazer validações de regra de negócio;
