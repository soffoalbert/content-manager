import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const swaggerConfig = (app) => {
  const options = new DocumentBuilder()
    .setTitle('Content Review And Approval REST API')
    .setDescription('This REST API is used for reviewing and approving/rejecting content')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
};
