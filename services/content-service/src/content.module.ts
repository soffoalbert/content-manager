import { Module } from '@nestjs/common';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import * as Joi from '@hapi/joi';
import { ConfigModule } from '@nestjs/config';
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
  providers: [{
    provide: 'S3',
    useValue: new S3({
      accessKeyId: '',
      secretAccessKey: '',
      region: 'eu-central-1', // Change to your desired region
    }),
  }, ContentService],
})
export class ContentModule { }
