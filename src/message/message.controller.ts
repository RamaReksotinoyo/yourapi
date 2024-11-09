import { Controller, Post, Get, Body, Query, UseGuards, Request, Injectable, NotFoundException } from '@nestjs/common';
import { MessageService } from './message.service';
import { AuthGuard } from '@nestjs/passport';
import { BaseResponseSuccess  } from 'src/utils/base-response';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

@Controller('api')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @UseGuards(JwtAuthGuard)
  @Post('sendMessage')
  async sendMessage(@Request() req, @Body() body: { receiverId: string; content: string }) {
    const senderId = req.user.id;
    const data = await this.messageService.sendMessage(senderId, body.receiverId, body.content);
    
    return new BaseResponseSuccess(data, 201, 'Created'); 
  }

  @UseGuards(JwtAuthGuard)
  @Get('viewMessages')
  async viewMessages(@Request() req, @Query('withUser') withUserId: string) {
    const userId = req.user.id;
    const data = await this.messageService.viewMessages(userId, withUserId);

    return new BaseResponseSuccess(data, 200, 'Ok'); 
  }
}
