import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from '@hapi/joi';

@Module({
  imports: [ConfigModule.forRoot({
    validationSchema: Joi.object({
      AUTH_EMAIL_ACCOUNT_ADDRESS: Joi.string().required(),
      AUTH_EMAIL_ACCOUNT_PASSWORD: Joi.string().required(),
    }),
  })],
  controllers: [NotificationController],
  providers: [NotificationService, ConfigService],
})
export class NotificationModule { }
