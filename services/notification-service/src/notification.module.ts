import { Module, UnauthorizedException } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { ConfigurationModule } from './configuration/configuration.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigurationService } from './configuration/configuration.service';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
