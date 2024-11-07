import { IsOptional, IsString, IsDateString } from 'class-validator';

export class CreateAboutDto {
    @IsOptional()
    @IsString()
    userId?: string;

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
  bio?: string;
}