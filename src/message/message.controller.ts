import { Controller, Post, Get, Body, Query, UseGuards, Request, Injectable } from '@nestjs/common';
import { MessageService } from './message.service';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

@Controller('api')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @UseGuards(JwtAuthGuard)
  @Post('sendMessage')
  async sendMessage(@Request() req, @Body() body: { receiverId: string; content: string }) {
    const senderId = req.user.id;
    return await this.messageService.sendMessage(senderId, body.receiverId, body.content);
  }

  @UseGuards(JwtAuthGuard)
  @Get('viewMessages')
  async viewMessages(@Request() req, @Query('withUser') withUserId: string) {
    const userId = req.user.id;
    return await this.messageService.viewMessages(userId, withUserId);
  }
}
