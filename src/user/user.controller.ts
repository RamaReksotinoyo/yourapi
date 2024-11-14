import {
    Controller,
    Post,
    Request,
    Logger,
    ConflictException,
    HttpStatus,
  } from '@nestjs/common';
  import { UserService } from './user.service';
  import { BaseResponseSuccess  } from '../utils/base-response';
  import { CreateUserDto } from './create-user.dto';
  import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
  
  @Controller('api')
  export class UserController {
    logger: Logger;
    constructor(private readonly userService: UserService) {
      this.logger = new Logger(UserController.name);
    }
  
    @Post('register')
    @ApiOperation({ summary: 'Register new user' })
    @ApiBody({ type: CreateUserDto })
    @ApiResponse({ 
      status: 201, 
      description: 'User successfully created',
      schema: {
        example: {
          data: {
            username: 'johndoe',
            email: 'user@example.com',
            _id: '507f1f77bcf86cd799439011'
          },
          statusCode: 201,
          message: 'Created'
        }
      }
    })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 409, description: 'User Already Exists' })
    async create(@Request() req): Promise<any> {
      const newUser = req.body;
      try {
        const query = { email: newUser.email };
        const isUser = await this.userService.findOne(query);
        if (isUser) throw new ConflictException('User Already Exist');
        const data = await this.userService.create(newUser);
        return new BaseResponseSuccess(data, 201, 'Created');
      } catch (err) {
        this.logger.error('Something went wrong in signup:', err);
        throw err;
      }
    }
  }