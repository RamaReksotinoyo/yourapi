import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AboutModule } from './about/about.module';
import { MessageModule } from './message/message.module';


@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/yourapi'),
    UserModule,
    AuthModule,
    AboutModule,
    MessageModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
