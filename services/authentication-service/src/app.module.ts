import { Module } from '@nestjs/common';
import { AuthenticationModule } from './authentication.module';
import { AuthenticationController } from './authentication.controller';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';

@Module({
  imports: [ConfigModule.forRoot({
    validationSchema: Joi.object({
      USER_SERVICE_HOST: Joi.string().required(),
      USER_SERVICE_PORT: Joi.number().required(),
      JWT_SECRET: Joi.string().required(),
      JWT_EXPIRATION_DURATION: Joi.string().required(),
    }),
  }),
    AuthenticationModule,
  ],
  controllers: [AuthenticationController]
})
export class AppModule {}
