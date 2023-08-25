import { PartialType } from '@nestjs/mapped-types';
import { CreateMediaDto } from './create-media.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateMediaDto extends PartialType(CreateMediaDto) {
  @IsNotEmpty()
  @IsString()
  title: string;
  @IsNotEmpty()
  @IsString()
  username: string;
}
