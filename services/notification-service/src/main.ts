import { NestFactory } from '@nestjs/core';
import { NotificationModule } from './notification.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(NotificationModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://user:bitnami@rabbitmq:5672/'],
      queue: 'notification_queue',
      queueOptions: {
        durable: false,
      },
    },
  });
  await app.listen();
}

bootstrap();
