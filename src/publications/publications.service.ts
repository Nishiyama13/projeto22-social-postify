import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { PublicationsRepository } from './publications.repository';
import { PublicationDataDto } from './dto/publicationDataDto';
import { IdNotFoundException } from '../exceptions/id-not-found.exception';
import { PostsService } from '../posts/posts.service';
import { MediasService } from '../medias/medias.service';
import { ActionForbiddenException } from '../exceptions/action-forbidden.exception';

@Injectable()
export class PublicationsService {
  constructor(
    private readonly repository: PublicationsRepository,
    private readonly postsService: PostsService,
    private readonly mediasService: MediasService,
  ) {}

  private validateId(id: number) {
    if (isNaN(id) || id <= 0) {
      throw new IdNotFoundException(id);
    }
  }

  private formatPublicationData(data: PublicationDataDto) {
    const responseData: PublicationDataDto = {
      id: data.id,
      mediaId: data.mediaId,
      postId: data.postId,
      date: data.date,
    };
    return responseData;
  }

  async create(
    body: CreatePublicationDto,
  ): Promise<Omit<PublicationDataDto, 'id'>> {
    await this.postsService.findOne(body.postId);
    await this.mediasService.findOne(body.mediaId);

    const publicationData = await this.repository.create(body);
    const responseData = {
      mediaId: publicationData.mediaId,
      postId: publicationData.postId,
      date: publicationData.date,
    };
    return responseData;
  }

  async findAll(): Promise<PublicationDataDto[]> {
    const publicationDataList = await this.repository.findAll();
    const responseDataList: PublicationDataDto[] = publicationDataList.map(
      (publicationData) => {
        return this.formatPublicationData(publicationData);
      },
    );
    return responseDataList;
  }

  async findOne(id: number): Promise<PublicationDataDto> {
    this.validateId(id);

    const publicationById = await this.repository.findOne(id);

    if (!publicationById) {
      throw new IdNotFoundException(id);
    }
    return this.formatPublicationData(publicationById);
  }

  async update(
    id: number,
    body: UpdatePublicationDto,
  ): Promise<Omit<PublicationDataDto, 'id'>> {
    const { postId, mediaId, date } = body;
    const currentDate = new Date();
    if (!postId || !mediaId || !date) {
      throw new BadRequestException(
        'Insira valores para postId, mediaId e date',
      );
    }
    this.validateId(id);
    const checkPublicationById = await this.repository.findOne(id);
    if (!checkPublicationById) {
      throw new IdNotFoundException(id);
    }
    await this.postsService.findOne(body.postId);
    await this.mediasService.findOne(body.mediaId);

    if (checkPublicationById.date <= currentDate) {
      throw new ActionForbiddenException(id);
    }
    const publicationById = await this.repository.update(id, body);
    const responseData = {
      mediaId: publicationById.mediaId,
      postId: publicationById.postId,
      date: publicationById.date,
    };
    return responseData;
  }

  async remove(id: number) {
    return `This action removes a #${id} publication`;
  }
}
