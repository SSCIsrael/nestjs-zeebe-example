import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ZeebeModule, ZeebeServer } from '@payk/nestjs-zeebe/dist';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ZeebeModule.forRoot({ gatewayAddress: process.env.ZEEBE_GATEWAY})
  ],
  controllers: [AppController],
  providers: [AppService, ZeebeServer],
})
export class AppModule {}
