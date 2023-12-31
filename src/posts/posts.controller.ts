import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UsePipes,
  ValidationPipe,
  Delete,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostDataDto } from './dto/post-data.dto';
import { PublicationsService } from '../publications/publications.service';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly publicationService: PublicationsService,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() body: CreatePostDto): Promise<Omit<PostDataDto, 'id'>> {
    return await this.postsService.create(body);
  }

  @Get()
  async findAll(): Promise<PostDataDto[]> {
    return await this.postsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PostDataDto> {
    return await this.postsService.findOne(+id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(@Param('id') id: string, @Body() body: UpdatePostDto) {
    return await this.postsService.update(+id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.postsService.removePost(+id);
  }
}
