import { Module } from '@nestjs/common';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import * as Joi from '@hapi/joi';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { Content } from './content.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S3 } from 'aws-sdk';

@Module({
  imports: [ConfigModule.forRoot({
    validationSchema: Joi.object({
      POSTGRES_HOST: Joi.string().required(),
      POSTGRES_PORT: Joi.number().required(),
      POSTGRES_USER: Joi.string().required(),
      POSTGRES_PASSWORD: Joi.string().required(),
      POSTGRES_DB: Joi.string().required(),
      PORT: Joi.number(),
    }),
  }),
  TypeOrmModule.forFeature([Content]),
    DatabaseModule
  ],
  controllers: [ContentController],
  providers: [
    {
      provide: 'S3',
      useFactory: (configurationService: ConfigService) => {
        const s3Config = new S3({
          accessKeyId: configurationService.get('S3_ACCESS_KEY_ID'),
          secretAccessKey: configurationService.get('S3_SECRET_ACCESS_KEY'),
          region: configurationService.get('S3_REGION', 'eu-central-1'),
        });
        return s3Config;
      }, inject: [ConfigService]
    },
    ContentService,
  ],
})
export class ContentModule { }
