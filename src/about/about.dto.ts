import { IsOptional, IsString, IsDateString } from 'class-validator';

export class CreateAboutDto {
  @IsString()
  userId: string; // ID pengguna yang harus ada

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsDateString()
  birthDate?: Date;

  @IsOptional()
  @IsString()
  zodiac?: string;

  @IsOptional()
  @IsString()
  horoscope?: string;

  @IsOptional()
  @IsString()
  bio?: string;
}