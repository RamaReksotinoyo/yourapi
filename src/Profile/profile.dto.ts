import { IsOptional, IsString, IsDateString, Length, Matches } from 'class-validator';

export class CreateProfileDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  @Length(2, 25, { message: 'First name must be between 2 and 25 characters.' })
  firstName?: string;

  @IsOptional()
  @IsString()
  @Length(2, 25, { message: 'Last name must be between 2 and 25 characters.' })
  lastName?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Birth date must be a valid date string.' })
  birthDate?: Date;

  @IsOptional()
  @IsString()
  @Length(3, 255, { message: 'Bio must be between 3 and 255 characters.' })
  bio?: string;
}