import { NestFactory } from "@nestjs/core";
import { ContentModule } from "./content.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

async function bootstrap() {
  // const app = await NestFactory.createMicroservice<MicroserviceOptions>(ContentModule, {
  //   transport: Transport.TCP,
  //   options: {
  //     port: 3003,
  //   },
  // });

    const app = await NestFactory.createMicroservice<MicroserviceOptions>(ContentModule, {
    transport: Transport.TCP,
    options: {
      port: 3003,
    },
  });
  await app.listen();
}
bootstrap();

