import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address',
  })
  email: string;

  @ApiProperty({
    example: 'Password123!!',
    description: 'User password',
  })
  password: string;
}