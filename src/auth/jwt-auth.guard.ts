import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw new UnauthorizedException({
        error: info?.message || 'Token validation failed',
        message: 'Unauthorized',
        statusCode: 401
      });
    }
    return user;
  }
}