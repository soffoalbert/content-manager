import { Controller, Get } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationDTO } from './notification.dto';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @MessagePattern({cmd: 'notifyByEmail'})
  async getHello(@Payload() data: string): Promise<any> {
    try {
      console.log(data)
      return await this.notificationService.sendMail(data);
    } catch (error) {
      throw new RpcException(error.message)
    }
  }
}
