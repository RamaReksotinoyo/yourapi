import {
  Controller,
  Post,
  Logger,
  Request,
  UseGuards,
  Get,
  Injectable, 
  HttpException
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { BaseResponseSuccess  } from '../utils/base-response';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiBody, ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LoginDto } from './auth.dto';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  handleRequest(err: any, user: any, info: any, context: any, status: any) {
    if (err || !user) {
      throw new HttpException(err.message, err.status);
    }
    return user;
  }
}

@ApiTags('Authentication')
@Controller('api')
export class AuthController {
  logger: Logger;
  constructor(
      private readonly authService: AuthService,
  ) {
      this.logger = new Logger(AuthController.name);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 201, description: 'Login successful' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async login(@Request() req): Promise<any> {
      try {
        const data = await this.authService.generateJwtToken(req.user); 
        return new BaseResponseSuccess(data, 201, 'Ok');
      } catch (error) {
        throw error;
      }
  }

  // @UseGuards(JwtAuthGuard)
  // @Get('viewProfile')
  // @ApiBearerAuth()
  // @ApiOperation({ summary: 'Get user profile' })
  // async getUser(@Request() req): Promise<any> {
  //   return new BaseResponseSuccess(req.user, 200, 'Ok');
  // }
}