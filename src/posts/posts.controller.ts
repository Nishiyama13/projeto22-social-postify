import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() body: CreatePostDto) {
    return await this.postsService.create(body);
  }

  @Get()
  async findAll() {
    return await this.postsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.postsService.findOne(+id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: UpdatePostDto) {
    return await this.postsService.update(+id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.postsService.remove(+id);
  }
}
