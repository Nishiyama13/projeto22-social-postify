import { IsNotEmpty, IsUrl } from 'class-validator';

export class Media {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  @IsUrl()
  username: string;
}
