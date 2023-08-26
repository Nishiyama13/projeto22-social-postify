import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsRepository } from './posts.repository';
import { IdNotFoundException } from '../exceptions/id-not-found.exception';
import { PostDataDto } from './dto/post-data.dto';

@Injectable()
export class PostsService {
  constructor(private readonly repository: PostsRepository) {}

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

  async create(body: CreatePostDto): Promise<PostDataDto> {
    if (!body || !body.title || !body.text) {
      throw new BadRequestException('Insira valores para title e/ou text');
    }
    const postData = await this.repository.create(body);
    return this.formatPostData(postData);
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

  async update(id: number, body: UpdatePostDto) {
    this.validateId(id);
    const postById = await this.repository.findOne(id);
    if (!postById) {
      throw new IdNotFoundException(id);
    }

    const postData = await this.repository.update(id, body);
    return this.formatPostData(postData);
  }

  async remove(id: number) {
    return await `This action removes a #${id} post`;
  }
}
