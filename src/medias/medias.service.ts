import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { MediasRepository } from './medias.repository';
import { IdNotFoundException } from '../exceptions/id-not-found.exception';
import { DuplicateDataException } from '../exceptions/duplicate-data.exception';
import { MediaDataDto } from './dto/media-data.dto';
import { PublicationsService } from '../publications/publications.service';
import { PostOrMediaForbiddenException } from '../exceptions/post-or-media-forbidden.excetion';

@Injectable()
export class MediasService {
  constructor(
    private readonly repository: MediasRepository,
    @Inject(forwardRef(() => PublicationsService))
    private readonly publicationService: PublicationsService,
  ) {}

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
  }

  async removeMedia(id: number) {
    this.validateId(id);
    const mediaId: number = id;
    const checkMediaById = await this.repository.findOne(id);
    if (!checkMediaById) {
      throw new IdNotFoundException(id);
    }
    //eslint-disable-next-line
    const checkPublicationByMediaId = await this.publicationService.findOneByMediaId(mediaId);
    if (checkPublicationByMediaId) {
      throw new PostOrMediaForbiddenException(mediaId, 'media'); //mudar para um novo erro
    }

    await this.repository.removeMedia(id);
  }
}
