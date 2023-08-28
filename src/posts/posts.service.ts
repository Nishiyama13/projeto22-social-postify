import {
  forwardRef,
  Inject,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsRepository } from './posts.repository';
import { IdNotFoundException } from '../exceptions/id-not-found.exception';
import { PostDataDto } from './dto/post-data.dto';
import { ActionForbiddenException } from '../exceptions/action-forbidden.exception';
import { PublicationsService } from '../publications/publications.service';

@Injectable()
export class PostsService {
  constructor(
    private readonly repository: PostsRepository,
    @Inject(forwardRef(() => PublicationsService))
    private readonly publicationService: PublicationsService,
  ) {}

  private validateId(id: number) {
    if (isNaN(id) || id <= 0) {
      throw new IdNotFoundException(id);
    }
  }

  private formatPostData(data: PostDataDto) {
    const responseData: PostDataDto = {
      id: data.id,
      title: data.title,
      text: data.text,
    };

    if (data.image !== null) {
      responseData.image = data.image;
    }
    return responseData;
  }

  async create(body: CreatePostDto): Promise<Omit<PostDataDto, 'id'>> {
    if (!body || !body.title || !body.text) {
      throw new BadRequestException('Insira valores para title e/ou text');
    }
    const postData = await this.repository.create(body);
    const responseData: Omit<PostDataDto, 'id'> = {
      title: postData.title,
      text: postData.text,
    };

    if (postData.image !== null) {
      responseData.image = postData.image;
    }
    return responseData;
  }

  async findAll(): Promise<PostDataDto[]> {
    const postDataList = await this.repository.findAll();
    const responseDataList: PostDataDto[] = postDataList.map((postData) => {
      return this.formatPostData(postData);
    });
    return responseDataList;
  }

  async findOne(id: number): Promise<PostDataDto> {
    this.validateId(id);
    const postById = await this.repository.findOne(id);
    if (!postById) {
      throw new IdNotFoundException(id);
    }
    return this.formatPostData(postById);
  }

  async update(
    id: number,
    body: UpdatePostDto,
  ): Promise<Omit<PostDataDto, 'id'>> {
    this.validateId(id);
    const postById = await this.repository.findOne(id);
    if (!postById) {
      throw new IdNotFoundException(id);
    }

    const postData = await this.repository.update(id, body);
    const responseData: Omit<PostDataDto, 'id'> = {
      title: postData.title,
      text: postData.text,
    };

    if (postData.image !== null) {
      responseData.image = postData.image;
    }
    return responseData;
  }

  async removePost(id: number) {
    this.validateId(id);
    const postId: number = id;
    const checkPostById = await this.repository.findOne(id);
    if (!checkPostById) {
      throw new IdNotFoundException(id);
    }
    //eslint-disable-next-line
    const checkPublicationByPostId = await this.publicationService.findOneByPostId(postId);
    if (checkPublicationByPostId) {
      throw new ActionForbiddenException(postId); //mudar para um novo erro
    }

    await this.repository.removePost(id);
  }
}
