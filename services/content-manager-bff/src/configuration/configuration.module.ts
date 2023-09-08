import { Module } from '@nestjs/common';
import { ConfigurationService } from './configuration.service';
import { ConfigModule } from "@nestjs/config";
import * as Joi from '@hapi/joi';

@Module({
  exports: [ConfigurationService],
  imports: [ConfigModule.forRoot({
    validationSchema: Joi.object({
      USER_SERVICE_HOST: Joi.string().required(),
      USER_SERVICE_PORT: Joi.number().required(),
      AUTHENTICATION_SERVICE_HOST: Joi.string().required(),
      AUTHENTICATION_SERVICE_PORT: Joi.number().required(),
    }),
  }),],
  providers: [ConfigurationService]
})
export class ConfigurationModule { }
