import { IsNotEmpty, IsString, IsMongoId } from 'class-validator';

export class CreateMessageDto {
    @IsString()
    @IsNotEmpty()
    @IsMongoId()
  receiver: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}

export class ViewMessagesDto {
  @IsNotEmpty()
  @IsMongoId()
  otherUserId: string;
}