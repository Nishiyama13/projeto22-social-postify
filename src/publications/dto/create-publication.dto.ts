import { IsDateString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePublicationDto {
  @IsNumber()
  @IsNotEmpty()
  mediaId: number;

  @IsNumber()
  @IsNotEmpty()
  postId: number;

  @IsDateString()
  @IsNotEmpty()
  date: Date;
}
