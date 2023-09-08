import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const swaggerConfig = (app) => {
  const options = new DocumentBuilder()
    .setTitle('User Management API')
    .setDescription('This API is used for user registration and authentication')
    .setVersion('1.0')
    .addTag('Authentication')
    .addTag('User')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
};
