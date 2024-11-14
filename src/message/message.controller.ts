import { Controller, Post, Get, Body, Query, UseGuards, Request, Injectable, NotFoundException } from '@nestjs/common';
import { MessageService } from './message.service';
import { AuthGuard } from '@nestjs/passport';
import { BaseResponseSuccess  } from '../utils/base-response';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@Controller('api')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @UseGuards(JwtAuthGuard)
  @Post('sendMessage')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Send a message to another user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        receiverId: {
          type: 'string',
          example: '507f1f77bcf86cd799439011',
          description: 'Receiver user ID'
        },
        content: {
          type: 'string',
          example: 'Hello, how are you?',
          description: 'Message content'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Message sent successfully',
    schema: {
      example: {
        data: {
          senderId: '507f1f77bcf86cd799439011',
          receiverId: '507f1f77bcf86cd799439012',
          content: 'Hello, how are you?',
          timestamp: '2023-01-01T00:00:00.000Z',
          _id: '507f1f77bcf86cd799439013'
        },
        statusCode: 201,
        message: 'Created'
      }
    }
  })
  async sendMessage(@Request() req, @Body() body: { receiverId: string; content: string }) {
    const senderId = req.user.id;
    const data = await this.messageService.sendMessage(senderId, body.receiverId, body.content);
    
    return new BaseResponseSuccess(data, 201, 'Created'); 
  }

  @UseGuards(JwtAuthGuard)
  @Get('viewMessages')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'View messages with another user' })
  @ApiQuery({
    name: 'withUser',
    type: String,
    description: 'ID of the user to view messages with',
    required: true
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Messages retrieved successfully',
    schema: {
      example: {
        data: [{
          senderId: '507f1f77bcf86cd799439011',
          receiverId: '507f1f77bcf86cd799439012',
          content: 'Hello, how are you?',
          timestamp: '2023-01-01T00:00:00.000Z',
          _id: '507f1f77bcf86cd799439013'
        }],
        statusCode: 200,
        message: 'Ok'
      }
    }
  })
  async viewMessages(@Request() req, @Query('withUser') withUserId: string) {
    const userId = req.user.id;
    const data = await this.messageService.viewMessages(userId, withUserId);

    return new BaseResponseSuccess(data, 200, 'Ok'); 
  }
}
