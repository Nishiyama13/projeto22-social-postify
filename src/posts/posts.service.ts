import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsRepository } from './posts.repository';
import { IdNotFoundException } from '../exceptions/id-not-found.exception';

@Injectable()
export class PostsService {
  constructor(private readonly repository: PostsRepository) {}

  async create(body: CreatePostDto) {
    if (!body || !body.title || !body.text) {
      throw new BadRequestException('Insira valores para title e text'); //da para colocar um erro perssonalizado
    }
    const postData = await this.repository.create(body);

    if (!body.image) {
      return {
        id: postData.id,
        title: postData.title,
        text: postData.text,
      };
    }
    return postData;
  }

  async findAll() {
    const postDataList = await this.repository.findAll();

    const responseDataList = postDataList.map((postData) => {
      const responseData = {
        id: postData.id,
        title: postData.title,
        text: postData.text,
      };

      if (!postData.image) {
        return responseData;
      }

      return postData;
    });

    return responseDataList;
  }

  async findOne(id: number) {
    if (isNaN(id) || id <= 0) throw new IdNotFoundException(id);
    const postById = await this.repository.findOne(id);

    if (!postById) {
      throw new IdNotFoundException(id);
    }

    const responseData = {
      id: postById.id,
      title: postById.title,
      text: postById.text,
    };

    if (postById.image === null) {
      return responseData;
    }

    return postById;
  }

  async update(id: number, body: UpdatePostDto) {
    if (isNaN(id) || id <= 0) throw new IdNotFoundException(id);

    const postById = await this.repository.findOne(id);
    if (!postById) {
      throw new IdNotFoundException(id);
    }

    const postData = await this.repository.update(id, body);
    if (!postData.image) {
      return {
        id: postData.id,
        title: postData.title,
        text: postData.text,
      };
    }
    return postData;
  }

  async remove(id: number) {
    return await `This action removes a #${id} post`;
  }
}
