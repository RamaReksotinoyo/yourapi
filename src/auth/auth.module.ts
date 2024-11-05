import { Module, forwardRef, Injectable, Logger,  } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwtStrategy';
import { UserModule } from '../user/user.module';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  logger: Logger;
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
    this.logger = new Logger(LocalStrategy.name)
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password);
    this.logger.log('Logged In User ,checking at local auth:', user);
    return user;
  }
}

@Module({
  imports: [
    JwtModule.register({
      secret: 'JWT_SECRET',
      signOptions: { expiresIn: '3000s' },
    }),
    forwardRef(() => UserModule),
    PassportModule,
  ],

  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule { }