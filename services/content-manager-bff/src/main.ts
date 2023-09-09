import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { swaggerConfig } from 'src/swagger.config';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  swaggerConfig(app)
  await app.listen(3000);

}
bootstrap();
