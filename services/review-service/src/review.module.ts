import { Module, UnauthorizedException } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { DatabaseModule } from './database/database.module';
import { Review } from './review.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigurationModule } from './configuration/configuration.module';
import { ConfigurationService } from './configuration/configuration.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [ConfigModule.forRoot({
    validationSchema: Joi.object({
      POSTGRES_HOST: Joi.string().required(),
      POSTGRES_PORT: Joi.number().required(),
      POSTGRES_USER: Joi.string().required(),
      POSTGRES_PASSWORD: Joi.string().required(),
      POSTGRES_DB: Joi.string().required(),
      PORT: Joi.number(),
      USER_SERVICE_HOST: Joi.string().required(),
      USER_SERVICE_PORT: Joi.number().required(),
    }),
  }),
  JwtModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      secret: configService.get('JWT_SECRET', 'test-secret'),
      signOptions: {
        expiresIn: configService.get('JWT_EXPIRE_IN', '1h'),
      },
    }),
  }),
  ConfigurationModule,
  ClientsModule.registerAsync([
    {
      name: 'USER_SERVICE',
      imports: [ConfigurationModule],
      inject: [ConfigurationService],
      useFactory: (configService: ConfigurationService) => {
        const userServiceOptions = configService.userServiceOptions;
        if (!userServiceOptions) {
          throw new UnauthorizedException('USER_SERVICE options not found');
        }
        return {
          transport: Transport.TCP,
          options: {
            port: 3002,
            host: 'localhost'
          }
         
        };
      },
    },
    {
      name: 'NOTIFICATION_SERVICE',
      imports: [ConfigurationModule],
      inject: [ConfigurationService],
      useFactory: (configService: ConfigurationService) => {
        const authServiceOptions = configService.authenticationServiceOptions;
        if (!authServiceOptions) {
          throw new UnauthorizedException('NOTIFICATION_SERVICE options not found');
        }
        return {
          transport: Transport.RMQ,
          options: {
            urls: ['amqp://user:bitnami@localhost:5672/'], // Replace username and password
            queue: 'notification_queue',
            queueOptions: {
              durable: false,
            },
          },
        };
      },
    },
    {
      name: 'CONTENT_SERVICE',
      imports: [ConfigurationModule],
      inject: [ConfigurationService],
      useFactory: (configService: ConfigurationService) => {
        const authServiceOptions = configService.authenticationServiceOptions;
        if (!authServiceOptions) {
          throw new UnauthorizedException('CONTENT_SERVICE options not found');
        }
        return {
          transport: Transport.TCP,
          options: {
            port: 3003,
            host: 'localhost'
          }
        };
      },
    },
  ]),
  TypeOrmModule.forFeature([Review]),
    DatabaseModule
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule { }
