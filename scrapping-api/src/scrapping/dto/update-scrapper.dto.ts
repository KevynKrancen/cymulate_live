import {
  IsString,
  IsAlpha,
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsEmail,
} from 'class-validator';

export class TaskDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}
