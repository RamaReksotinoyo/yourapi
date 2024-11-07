import { Injectable, forwardRef, Inject, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './message.model';
import { UserService } from '../user/user.service';


@Injectable()
export class MessageService {
  constructor(
    @Inject(forwardRef(() => UserService)) private UserService: UserService,
    @InjectModel(Message.name) private readonly messageModel: Model<MessageDocument>,
  ) {}

  // Send a message from one user to another
  async sendMessage(senderId: string, receiverId: string, content: string): Promise<Message> {
    

    const user = await this.UserService.findOne({ _id: receiverId });
    if (!user) throw new BadRequestException('ReciverId Not Found');

    const message = new this.messageModel({
      senderId,
      receiverId,
      content,
    });
    return await message.save();
  }

  // View messages between two users
  async viewMessages(userId1: string, userId2: string): Promise<Message[]> {
    return this.messageModel.find({
      $or: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 },
      ],
    }).sort({ timestamp: 1 }).exec();
  }
}
