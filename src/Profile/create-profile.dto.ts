import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString, Length } from 'class-validator';

export class CreateProfileBody {
  @ApiProperty({
    required: false,
    example: 'John',
    description: 'First name (2-25 characters)'
  })
  @IsOptional()
  @IsString()
  @Length(2, 25)
  firstName?: string;

  @ApiProperty({
    required: false,
    example: 'Doe',
    description: 'Last name (2-25 characters)'
  })
  @IsOptional()
  @IsString()
  @Length(2, 25)
  lastName?: string;

  @ApiProperty({
    required: false,
    example: '1990-01-01',
    description: 'Birth date in ISO format'
  })
  @IsOptional()
  @IsDateString()
  birthDate?: Date;

  @ApiProperty({
    required: false,
    example: 'I love coding and reading books',
    description: 'Bio (3-255 characters)'
  })
  @IsOptional()
  @IsString()
  @Length(3, 255)
  bio?: string;
}