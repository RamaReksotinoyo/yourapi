import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'johndoe',
    description: 'Username (5-25 characters)',
    minLength: 5,
    maxLength: 25
  })
  username: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address'
  })
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'Password (must contain 8 chars, lowercase, uppercase, numbers, and symbols)',
    minLength: 8
  })
  password: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'Confirm password (must match password)'
  })
  confirmPassword: string;
}