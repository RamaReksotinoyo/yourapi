import {
    Controller,
    Post,
    Request,
    Logger,
    ConflictException,
    HttpStatus,
  } from '@nestjs/common';
  import { UserService } from './user.service';
  import { BaseResponseSuccess  } from 'src/utils/base-response';
  
  @Controller('api')
  export class UserController {
    logger: Logger;
    constructor(private readonly userService: UserService) {
      this.logger = new Logger(UserController.name);
    }
  
    @Post('register')
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