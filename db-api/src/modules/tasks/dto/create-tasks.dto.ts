import {
    IsString,
    IsAlpha,
    MinLength,
    MaxLength,
    IsNotEmpty,
    IsEmail,
  } from 'class-validator';


export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  urlToScrape: string;
}

