import { Injectable } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { MediasRepository } from './medias.repository';
import { IdNotFoundException } from '../exceptions/id-not-found.exception';
import { DuplicateDataException } from '../exceptions/duplicate-data.exception';
import { MediaDataDto } from './dto/media-data.dto';

@Injectable()
export class MediasService {
  constructor(private readonly repository: MediasRepository) {}

  private validateId(id: number) {
    if (isNaN(id) || id <= 0) {
      throw new IdNotFoundException(id);
    }
  }

  private formatMediaData(data: MediaDataDto) {
    const responseData: MediaDataDto = {
      id: data.id,
      title: data.title,
      username: data.username,
    };
    return responseData;
  }

  async create(body: CreateMediaDto): Promise<Omit<MediaDataDto, 'id'>> {
    const checkMedia = await this.repository.findByTitleAndUsername(
      body.title,
      body.username,
    );

    if (checkMedia) {
      throw new DuplicateDataException(body.title, body.username);
    }

    const mediaData = await this.repository.create(body);
    const responseData = {
      title: mediaData.title,
      username: mediaData.username,
    };
    return responseData;
    //return this.formatMediaData(mediaData);
  }

  async findAll(): Promise<MediaDataDto[]> {
    const mediaDataList = await this.repository.findAll();
    const responseDataList: MediaDataDto[] = mediaDataList.map((mediaData) => {
      return this.formatMediaData(mediaData);
    });
    return responseDataList;
  }

  async findOne(id: number): Promise<MediaDataDto> {
    this.validateId(id);

    const mediaById = await this.repository.findOne(id);

    if (!mediaById) {
      throw new IdNotFoundException(id);
    }
    const mediaData = await this.repository.findOne(id);
    return this.formatMediaData(mediaData);
  }

  async update(
    id: number,
    body: UpdateMediaDto,
  ): Promise<Omit<MediaDataDto, 'id'>> {
    this.validateId(id);

    const mediaById = await this.repository.findOne(id);
    if (!mediaById) {
      throw new IdNotFoundException(id);
    }
    const checkMedia = await this.repository.findByTitleAndUsername(
      body.title,
      body.username,
    );

    if (checkMedia) {
      throw new DuplicateDataException(body.title, body.username);
    }

    const mediaData = await this.repository.update(id, body);
    const responseData = {
      title: mediaData.title,
      username: mediaData.username,
    };
    return responseData;
    //return this.formatMediaData(mediaData);
  }

  remove(id: number) {
    return `This action removes a #${id} media`;
  }
}
