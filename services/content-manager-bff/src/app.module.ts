import { Module } from '@nestjs/common';
import * as Joi from '@hapi/joi';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { ContentModule } from './content/content.module';
import { ReviewModule } from './review/review.module';
import { AdministratorModule } from './admin/admin.module';

@Module({
  imports: [ConfigModule.forRoot({
    validationSchema: Joi.object({
      USER_SERVICE_HOST: Joi.string().required(),
      USER_SERVICE_PORT: Joi.number().required(),
      AUTHENTICATION_SERVICE_HOST: Joi.string().required(),
      AUTHENTICATION_SERVICE_PORT: Joi.number().required(),
      CONTENT_SERVICE_HOST: Joi.string().required(),
      CONTENT_SERVICE_PORT: Joi.number().required(),
      REVIEW_SERVICE_HOST: Joi.string().required(),
      REVIEW_SERVICE_PORT: Joi.number().required(),
    }),
  }),
    UserModule,
    ContentModule,
    ReviewModule,
    AdministratorModule
  ],
})
export class AppModule {
}
