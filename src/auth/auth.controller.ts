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

  
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  handleRequest(err: any, user: any, info: any, context: any, status: any) {
    if (err || !user) {
      throw new HttpException(err.message, err.status);
    }
    return user;
  }
}

@Controller('auth')
export class AuthController {
logger: Logger;
constructor(
    private readonly authService: AuthService,
) {
    this.logger = new Logger(AuthController.name);
}

@Post('login')
@UseGuards(LocalAuthGuard)
async login(@Request() req): Promise<any> {
    try {
    //return req.user;
    return await this.authService.generateJwtToken(req.user);
    } catch (error) {
    throw error;
    }
}

@UseGuards(JwtAuthGuard)
@Get('viewProfile')
async getUser(@Request() req): Promise<any> {
    console.log('req errr: ', req.user)
    return req.user;
}
}