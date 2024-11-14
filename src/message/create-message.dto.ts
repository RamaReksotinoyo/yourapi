import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsMongoId } from 'class-validator';

export class CreateMessageBody {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'MongoDB ID of the message receiver'
  })
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  receiver: string;

  @ApiProperty({
    example: 'Hello, how are you?',
    description: 'Message content'
  })
  @IsNotEmpty()
  @IsString()
  content: string;
}

export class ViewMessagesDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'MongoDB ID of the other user'
  })
  @IsNotEmpty()
  @IsMongoId()
  otherUserId: string;
}