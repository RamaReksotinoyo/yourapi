import { IsOptional, IsString, IsDateString } from 'class-validator';

export class CreateAboutDto {
    @IsOptional()
    @IsString()
    userId?: string; // ID pengguna, tidak diinput manual

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