import { Controller, UseGuards } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LocalStrategy } from './local.strategy';

@Controller()
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) { }

  @MessagePattern({ cmd: 'login' })
  async login(@Payload() payload: any): Promise<{ access_token: string }> {
    return this.authService.login(payload);
  }

  @MessagePattern({ cmd: 'check' })
  async isLogedin(@Payload() payload: any): Promise<{ access_token: string }> {
    return this.authService.validateToken(payload.jwt);
  }
}
