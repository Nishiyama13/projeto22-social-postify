import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { MediasService } from './medias.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';

@Controller('medias')
export class MediasController {
  constructor(private readonly mediasService: MediasService) {}

  @Post()
  async create(@Body() body: CreateMediaDto) {
    return await this.mediasService.create(body);
  }

  @Get()
  async findAll() {
    return await this.mediasService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.mediasService.findOne(+id);
  }

  @Put(':id')
  async update(
    @Param('id')
    id: string,
    @Body() updateMediaDto: UpdateMediaDto,
  ) {
    return await this.mediasService.update(+id, updateMediaDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.mediasService.remove(+id);
  }
  /*
  @Get('error')
  getError() {
    return this.mediasService.generateError();
    /*
    try {
      return this.mediasService.generateError();
    } catch (error) {
      console.log('Estou sendo tratado');
      throw new HttpException('Fui tratado melhor!', HttpStatus.UNAUTHORIZED);
    }
    */
  //}
}
